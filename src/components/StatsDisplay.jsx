function StatsDisplay({ stats }) {
  return (
    <div className="stats mt-20 mb-16 flex gap-20 justify-center">
      <div className="flex">
        <div className="text-amber-200">Words/Min :</div>
        <div className="ml-1">{stats.wordspMin}</div>
      </div>
      <div className="flex">
        <div className="text-amber-200">Chars/Min :</div>
        <div className="ml-1">{stats.charspMin}</div>
      </div>
      <div className="flex">
        <div className="text-amber-200">Accuracy :</div>
        <div className="ml-1">
          {stats.accuracy ? Math.round(stats.accuracy) : 0}%
        </div>
      </div>
    </div>
  );
}

export default StatsDisplay;
