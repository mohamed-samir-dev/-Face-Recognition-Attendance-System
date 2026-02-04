export const getColorByIndex = (index: number) => {
  switch (index) {
    case 0: return 'bg-blue-500';
    case 1: return 'bg-green-500';
    case 2: return 'bg-purple-500';
    default: return 'bg-gray-400';
  }
};