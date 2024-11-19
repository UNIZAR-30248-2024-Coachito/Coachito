import React, { useEffect, useState } from 'react';
import { Text } from '../ui/text';
import { Input, InputField } from '../ui/input';
import { VStack } from '../ui/vstack';

interface ProcessedSet {
  peso: number;
  reps: number;
}

interface PredictionProps {
  exerciseSets: ProcessedSet[];
}

const Prediction: React.FC<PredictionProps> = ({ exerciseSets }) => {
  const [newRepsInputValue, setNewRepsInputValue] = useState('');
  const [calculated1RM, setCalculated1RM] = useState<any[]>([]);
  const [finalResults, setFinalResults] = useState<any[]>([]); // Nuevo estado para el segundo cálculo

  useEffect(() => {
    // Solo se calcula si exerciseSets tiene datos
    if (exerciseSets.length > 0) {
      const results = exerciseSets.map((set) => {
        const valor = set.peso * (1 + set.reps / 30); // Fórmula del 1RM
        return { ...set, valor }; // Agregar valor calculado al set
      });

      setCalculated1RM(results); // Guardamos el array calculado en el estado

      // Segundo cálculo, usando los valores de 1RM calculados previamente
      const secondCalculation = results.map((set) => {
        const newRepsAsNumber = parseInt(newRepsInputValue) || 0;
        const finalValue = set.valor / (1 + newRepsAsNumber / 30); // Ejemplo de cálculo adicional, multiplicando por 1.1
        return { ...set, finalValue }; // Agregamos el segundo valor al set
      });

      setFinalResults(secondCalculation); // Guardamos el resultado fina
    }
  }, [exerciseSets]); // Dependencia para recalcular cuando `exerciseSets` cambia

  return (
    <VStack className="p-4">
      {finalResults.length > 0 ? (
        finalResults.map((set, index) => (
          <Text key={index} className="bg-blue-500 rounded-lg w-full">
            Se recomienda emplear {index + 1} para llegar al número de 5
            repeticiones objetivo = {set.finalValue.toFixed(2)}
          </Text>
        ))
      ) : (
        <Text>No hay sets disponibles para calcular los valores.</Text>
      )}
    </VStack>
  );
};
export default Prediction;
