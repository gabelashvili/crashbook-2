const GameLayout = () => {
  return (
    <div className="grid grid-rows-[1fr_minmax(0,_min-content)] max-h-[680px] py-6 h-full max-w-2xl w-full m-auto px-2">
      <div className="relative w-full h-full rounded-xl">
        <img
          src="/src/assets/images/game-container-hood.png"
          alt="game-container-hood"
          className="w-full absolute top-0 left-0 aspect-[1/0.24]"
        />
        <div className="absolute px-2 left-[8.2%] top-[2px] min-w-12 text-xs sm:text-base flex items-center justify-center aspect-[1/0.9] bg-[url('/src/assets/images/score-bg.png')] bg-size-[100%_100%]">
          <p className="pb-3 sm:px-2 font-semibold flex gap-0.5 text-white">
            <span className="text-[#48B098]">100</span> <span>/</span>
            <span>100</span>
          </p>
        </div>
      </div>

      <div className="bg-blue-500 h-fit min-h-[150px]">Play settings</div>
    </div>
  );
};

export default GameLayout;
