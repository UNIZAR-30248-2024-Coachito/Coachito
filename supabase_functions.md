# get_dashboard_details
```
select 
  jsonb_build_object(
    'workoutId', w.id,
    'workoutName', wt.name,
    'workoutDate', w.created_at,
    'workoutTime', w.duration,
    'workoutVolume', w.volume,
    'workoutSeries', workout_series.total_sets
  ) as workout_header_resume,
  jsonb_build_object(
    'exercises', jsonb_agg(
      distinct jsonb_build_object(
        'exerciseName', e.name,
        'exerciseThumbnailUrl', e.exercise_thumbnail_url,
        'series', exercise_series.total_sets
      )
    )
  ) as workout_exercises_resume
from 
  workouts w
  left join workout_templates wt on w.template_id = wt.id
  left join workout_exercises we on we.workout_id = w.id
  left join exercises e on we.exercise_id = e.id
  left join lateral (
    select 
      exercise_id,
      sum(sets) as total_sets
    from workout_exercises
    where workout_id = w.id
    group by exercise_id
  ) as exercise_series on exercise_series.exercise_id = e.id
  left join lateral (
    select 
      workout_id,
      sum(sets) as total_sets
    from workout_exercises
    where workout_id = w.id
    group by workout_id
  ) as workout_series on workout_series.workout_id = w.id
where
  w.template = false
  and w.created_at >= current_date - interval '3 months'
group by 
  w.id, wt.name, w.created_at, w.duration, w.volume, workout_series.total_sets
order by
  w.created_at DESC
```

# get_exercise_details
```
with exercise_data as (
  select 
    e.id as id,
    e.name,
    e.exercise_image_url as imageUrl,
    COALESCE(mg.name, '') as primaryMuscleGroup,
    COALESCE(we.weight, 0) as weight,
    COALESCE(we.reps, 0) as reps,
    COALESCE(we.sets, 0) as sets,
    we.created_at,
    COALESCE(we.weight * (1 + (we.reps * we.sets) / 30.0), 0) as one_rep_max,
    COALESCE((we.weight * we.reps) * we.sets, 0) as serie_volume,
    we.workout_id
  from exercises e
  left join workout_exercises we on e.id = we.exercise_id and we.exercise_id = ex_id
  left join muscle_groups mg on mg.id = e.primary_muscle_group_id
  left join workouts w on w.id = we.workout_id
  where e.id = ex_id
),
workout_volumes as (
  select
    workout_id,
    sum(serie_volume) as total_volume
  from exercise_data
  group by workout_id
),
serie_records as (
  select distinct
    reps,
    max(COALESCE(weight, 0)) as personalBest
  from exercise_data
  where weight > 0 and reps > 0
  group by reps
),
recent_exercise_data as (
  select * 
  from exercise_data
  where created_at >= (current_date - interval '3 months')
),
data_points as (
  select 
    to_char(created_at, 'DD/MM') as date_label,
    round(max(COALESCE(weight, 0)), 2) as higher_weight,
    round(max(COALESCE(one_rep_max, 0)), 2) as best_1rm,
    round(max(COALESCE(serie_volume, 0)), 2) as best_volume
  from recent_exercise_data
  group by date_label
  order by min(created_at)
)
select jsonb_build_object(
  'id', COALESCE(ed.id, 0),
  'name', COALESCE(ed.name, ''),
  'imageUrl', COALESCE(ed.imageUrl, ''),
  'primaryMuscleGroup', COALESCE(ed.primaryMuscleGroup, ''),
  'higherWeight', COALESCE(max(ed.weight), 0),
  'best1rm', COALESCE(round(max(ed.one_rep_max), 2), 0),
  'bestSerieVolume', jsonb_build_object(
    'weight', COALESCE(max(ed.weight), 0),
    'reps', COALESCE(max(ed.reps), 0)
  ),
  'bestTotalVolume', COALESCE(max(wv.total_volume), 0),
  'serieRecords', 
    CASE 
      WHEN (select count(*) from serie_records) > 0 
      THEN jsonb_agg(distinct jsonb_build_object('reps', sr.reps, 'personalBest', COALESCE(sr.personalBest, 0)))
      ELSE '[]'::jsonb
    END,
  'dataPoints', 
    jsonb_build_array(
      jsonb_build_object(
        'dataPoints',
        CASE 
          WHEN (select SUM(COALESCE(higher_weight, 0)) from data_points) > 0 
          THEN jsonb_agg(distinct jsonb_build_object('label', dp.date_label, 'value', COALESCE(dp.higher_weight, 0)))
          ELSE '[]'::jsonb
        END,
        'dataTotal', COALESCE((select SUM(COALESCE(higher_weight, 0)) from data_points), 0) || ' kg'
      ),
      jsonb_build_object(
        'dataPoints',
        CASE 
          WHEN (select SUM(COALESCE(best_1rm, 0)) from data_points) > 0 
          THEN jsonb_agg(distinct jsonb_build_object('label', dp.date_label, 'value', COALESCE(dp.best_1rm, 0)))
          ELSE '[]'::jsonb
        END,
        'dataTotal', COALESCE((select SUM(COALESCE(best_1rm, 0)) from data_points), 0) || ' kg'
      ),
      jsonb_build_object(
        'dataPoints',
        CASE 
          WHEN (select SUM(COALESCE(best_volume, 0)) from data_points) > 0 
          THEN jsonb_agg(distinct jsonb_build_object('label', dp.date_label, 'value', COALESCE(dp.best_volume, 0)))
          ELSE '[]'::jsonb
        END,
        'dataTotal', COALESCE((select SUM(COALESCE(best_volume, 0)) from data_points), 0) || ' kg'
      )
    )
) as exercise_details
from exercise_data ed
left join workout_volumes wv on ed.workout_id = wv.workout_id
left join serie_records sr on true
left join data_points dp on true
group by ed.id, ed.name, ed.imageUrl, ed.primaryMuscleGroup;
```

# get_exercises_list
```
SELECT 
  e.id AS "id",
  e.name AS "name",
  e.exercise_thumbnail_url AS "thumbnailUrl",
  NULL::interval AS "restTime",
  '' AS "notes",
  mg.name AS "primaryMuscleGroup",
  '[]'::jsonb AS "sets"
FROM 
  exercises e
  LEFT JOIN muscle_groups mg ON mg.id = e.primary_muscle_group_id
ORDER BY 
  e.id;
```

# get_last_workout_details
```
WITH
  last_workout_template AS (
    SELECT
      w.id AS workout_id
    FROM
      workouts w
    WHERE
      w.template_id = templ_id AND w.template = true
    ORDER BY
      w.created_at DESC
    LIMIT
      1
  ),
  last_workout_no_template AS (
    SELECT
      w.id AS workout_id
    FROM
      workouts w
    WHERE
      w.template_id = templ_id AND w.template = false
    ORDER BY
      w.created_at DESC
    LIMIT
      1
  ),
  exercise_details AS (
    SELECT
      we.exercise_id,
      e.id AS exercise_db_id,
      e.name,
      e.exercise_thumbnail_url,
      we.rest_time,
      we.notes,
      mg.name AS primary_muscle_group,
      we.sets,
      we.reps,
      we.weight,
      we.target_number_reps
    FROM
      workout_exercises we
    JOIN last_workout_template lw ON we.workout_id = lw.workout_id
    JOIN exercises e ON we.exercise_id = e.id
    LEFT JOIN muscle_groups mg ON e.primary_muscle_group_id = mg.id
  ),
  expanded_sets AS (
    SELECT
      we.exercise_id,
      we.reps,
      we.weight,
      generate_series(1, we.sets) AS set_number
    FROM
      workout_exercises we
    JOIN last_workout_no_template lw ON we.workout_id = lw.workout_id
  )
SELECT
  jsonb_agg(
    DISTINCT jsonb_build_object(
      'id', ed.exercise_db_id,
      'name', ed.name,
      'thumbnailUrl', ed.exercise_thumbnail_url,
      'restTime', ed.rest_time,
      'notes', ed.notes,
      'primaryMuscleGroup', ed.primary_muscle_group,
      'targetReps', ed.target_number_reps,
      'sets', (
        SELECT
          jsonb_agg(
            jsonb_build_object('reps', es.reps, 'weight', es.weight)
          )
        FROM
          expanded_sets es
        WHERE
          es.exercise_id = ed.exercise_db_id
      )
    )
  ) AS exercise_resume
FROM
  exercise_details ed;
```

# get_routine_chart_data
```
WITH routine_workouts AS (
    SELECT 
        w.id AS workout_id,
        w.volume,
        w.duration,
        w.created_at,
        COALESCE(SUM(we.reps * we.sets), 0) AS total_reps
    FROM 
        workouts w
    LEFT JOIN 
        workout_exercises we ON w.id = we.workout_id
    WHERE 
        w.template_id = templ_id 
        AND w.template = false
    GROUP BY 
        w.id, w.volume, w.duration, w.created_at
),
formatted_data AS (
    SELECT 
        to_char(w.created_at, 'DD Mon.') AS label,
        w.volume AS volume,
        w.total_reps AS reps,
        FLOOR(EXTRACT(EPOCH FROM w.duration::interval) / 60) AS duration_in_minutes
    FROM 
        routine_workouts w
),
totals AS (
    SELECT 
        SUM(volume) AS total_volume,
        SUM(total_reps) AS total_reps,
        FLOOR(SUM(EXTRACT(EPOCH FROM duration::interval) / 60)) AS total_duration
    FROM 
        routine_workouts
)
SELECT jsonb_build_array(
    jsonb_build_object(
        'dataPoints', jsonb_agg(jsonb_build_object('label', fd.label, 'value', fd.volume)),
        'dataTotal', (SELECT total_volume FROM totals) || ' kg'
    ),
    jsonb_build_object(
        'dataPoints', jsonb_agg(jsonb_build_object('label', fd.label, 'value', fd.reps)),
        'dataTotal', (SELECT total_reps FROM totals) || ' reps'
    ),
    jsonb_build_object(
        'dataPoints', jsonb_agg(jsonb_build_object('label', fd.label, 'value', fd.duration_in_minutes)),
        'dataTotal', (SELECT total_duration FROM totals) || ' min'
    )
) AS data_chart_props
FROM 
    formatted_data fd;
```

# get_routines_details
```
WITH all_groups AS (
  SELECT 
      tg.id AS group_id,
      tg.name AS group_name
  FROM 
      workout_templates_group tg
),
last_workouts AS (
  SELECT DISTINCT ON (wt.id)
      wt.id AS template_id,
      w.id AS workout_id
  FROM 
      workout_templates wt
  JOIN workouts w ON w.template_id = wt.id
  WHERE 
      w.template = true
  ORDER BY wt.id, w.created_at DESC
),
grouped_routines AS (
  SELECT 
      wt.group_id,
      tg.name AS group_name,
      wt.id AS template_id,
      wt.name AS routine_name,
      string_agg(DISTINCT e.name, ', ') AS my_routine_exercises
  FROM 
      workout_templates wt
  LEFT JOIN last_workouts lw ON lw.template_id = wt.id
  LEFT JOIN workout_exercises we ON we.workout_id = lw.workout_id
  LEFT JOIN exercises e ON we.exercise_id = e.id
  LEFT JOIN workout_templates_group tg ON wt.group_id = tg.id
  WHERE 
      wt.deleted = false
  GROUP BY 
      wt.group_id, tg.name, wt.id, wt.name
),
formatted_data AS (
  SELECT 
      ag.group_id,
      ag.group_name,
      COALESCE(
          jsonb_agg(
              jsonb_build_object(
                  'templateId', gr.template_id,
                  'myRoutineName', gr.routine_name,
                  'myRoutineExercises', COALESCE(gr.my_routine_exercises, ''))
          ) FILTER (WHERE gr.template_id IS NOT NULL), 
          '[]'::jsonb
      ) AS routines
  FROM 
      -- Aseguramos que siempre haya al menos una fila, incluso si no hay grupos
      (SELECT NULL::bigint AS group_id, 'No Group' AS group_name 
       UNION ALL
       SELECT tg.id, tg.name 
       FROM workout_templates_group tg) ag
  LEFT JOIN 
      grouped_routines gr ON ag.group_id = gr.group_id
  GROUP BY 
      ag.group_id, ag.group_name
),
routines_without_group AS (
  SELECT 
      NULL AS group_id,
      'Mis Rutinas' AS group_name,
      COALESCE(
          jsonb_agg(
              jsonb_build_object(
                  'templateId', gr.template_id,
                  'myRoutineName', gr.routine_name,
                  'myRoutineExercises', COALESCE(gr.my_routine_exercises, ''))
          ), '[]'::jsonb
      ) AS routines
  FROM 
      grouped_routines gr
  WHERE 
      gr.group_id IS NULL
)
SELECT jsonb_agg(
    jsonb_build_object(
        'groupId', fd.group_id,
        'groupName', fd.group_name,
        'routines', fd.routines
    )
) || COALESCE(( 
    SELECT jsonb_agg(
        jsonb_build_object(
            'groupId', rnog.group_id,
            'groupName', rnog.group_name,
            'routines', rnog.routines
        )
    )
    FROM routines_without_group rnog
    WHERE rnog.routines IS NOT NULL
), '[]'::jsonb) AS grouped_routines_result
FROM formatted_data fd;
```

# get_template_workout_groups
```
SELECT jsonb_agg(
    jsonb_build_object(
        'routine_id', wt.id,
        'name', tg.name
    )
) AS groups
FROM workout_templates_group tg
join workout_templates wt on tg.id = wt.group_id;
```

# get_user_workouts
```
WITH
  user_workouts AS (
    SELECT DISTINCT
      w.id AS workout_id,
      w.duration,
      w.volume,
      w.created_at,
      COALESCE(SUM(we.reps * we.sets), 0) AS reps_count
    FROM
      workouts w
      JOIN workout_templates wt ON w.template_id = wt.id
      LEFT JOIN workout_exercises we ON w.id = we.workout_id
    WHERE
      w.template = false
    GROUP BY
      w.id,
      w.duration,
      w.volume,
      w.created_at
  )
SELECT
  jsonb_build_object(
    'username',
    (
      SELECT
        username
      FROM
        users
    ),
    'workoutsCount',
    (
      SELECT
        COUNT(*)
      FROM
        workouts
      WHERE
        template = false
        AND template_id IN (SELECT id FROM workout_templates)
    ),
    'workouts',
    (
      SELECT
        jsonb_agg(
          jsonb_build_object(
            'workoutId',
            uw.workout_id,
            'duration',
            uw.duration,
            'repsCount',
            uw.reps_count,
            'volumen',
            uw.volume,
            'created_at',
            uw.created_at
          )
        )
      FROM
        user_workouts uw
    )
  ) AS user_workouts_details;
```

# get_workout_details
```
WITH exercise_details AS (
  SELECT 
    we.exercise_id,
    e.id AS exercise_db_id,
    e.name,
    e.exercise_thumbnail_url,
    we.rest_time,
    we.notes,
    mg.name AS primary_muscle_group,
    we.sets,
    we.reps,
    we.weight,
    we.created_at
  FROM 
    workout_exercises we
  JOIN exercises e ON we.exercise_id = e.id
  LEFT JOIN muscle_groups mg ON e.primary_muscle_group_id = mg.id
  WHERE 
    we.workout_id = w_id
),
expanded_sets AS (
  SELECT 
    we.exercise_id,
    we.reps,
    we.weight,
    generate_series(1, we.sets) AS set_number,
    we.created_at
  FROM 
    workout_exercises we
  WHERE 
    we.workout_id = w_id
),
unique_exercises AS (
  SELECT 
    ed.exercise_db_id,
    ed.name,
    ed.exercise_thumbnail_url,
    ed.rest_time,
    ed.notes,
    ed.primary_muscle_group,
    MIN(ed.created_at) AS created_at
  FROM 
    exercise_details ed
  GROUP BY 
    ed.exercise_db_id, ed.name, ed.exercise_thumbnail_url, ed.rest_time, ed.notes, ed.primary_muscle_group
)
SELECT jsonb_build_object(
  'workout_header_resume', jsonb_build_object(
    'workoutId', w.id,
    'workoutName', wt.name,
    'workoutDate', w.created_at,
    'workoutTime', w.duration,
    'workoutVolume', w.volume,
    'workoutSeries', workout_series.total_sets
  ),
  'exercise_resume', jsonb_agg(
    jsonb_build_object(
      'id', ue.exercise_db_id,
      'name', ue.name,
      'thumbnailUrl', ue.exercise_thumbnail_url,
      'restTime', ue.rest_time,
      'notes', ue.notes,
      'primaryMuscleGroup', ue.primary_muscle_group,
      'sets', (
        SELECT jsonb_agg(
          jsonb_build_object('reps', es.reps, 'weight', es.weight)
          ORDER BY es.created_at ASC
        )
        FROM expanded_sets es
        WHERE es.exercise_id = ue.exercise_db_id
      )
    )
    ORDER BY ue.created_at ASC
  )
) AS workout_details
FROM 
  workouts w
  LEFT JOIN workout_templates wt ON w.template_id = wt.id
  LEFT JOIN LATERAL (
    SELECT 
      workout_id,
      SUM(sets) AS total_sets
    FROM 
      workout_exercises
    WHERE 
      workout_id = w.id
    GROUP BY 
      workout_id
  ) AS workout_series ON workout_series.workout_id = w.id
  LEFT JOIN unique_exercises ue ON ue.exercise_db_id IN (
    SELECT exercise_db_id FROM exercise_details WHERE exercise_db_id = ue.exercise_db_id
  )
WHERE
  w.id = w_id
GROUP BY
  w.id, wt.name, w.created_at, w.duration, w.volume, workout_series.total_sets;
```

# handle_new_user
```
begin
  -- Insertar datos del nuevo usuario en la tabla `users`
  insert into public.users (id, username, email, created_at)
  values (new.id, -- Usamos el id del usuario desde `auth.users`, que es un UUID
          new.raw_user_meta_data->>'username', 
          new.email,
          current_timestamp);  -- Asignamos la fecha actual a `created_at`
  
  return new;
end;
```

# routine_title_exists
```
SELECT EXISTS (
    SELECT 1
    FROM workout_templates
    WHERE LOWER(name) = LOWER(routine_title)
      AND (
        group_id = folder_id OR (folder_id = 0 AND group_id IS NULL)
      )
);
```