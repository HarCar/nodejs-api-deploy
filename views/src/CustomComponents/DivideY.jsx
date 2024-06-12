const DivideY = () => {
  return (
    <div className="relative flex gap-[17px] ">
      <svg xmlns="http://www.w3.org/2000/svg"
        className="absolutex w-full sm:px-4 lg:max-w-7xl left-0 right-0 h-px w-screen"
        fill="none">
        <defs>
          <pattern id=":S1:" patternUnits="userSpaceOnUse" width="16" height="1">
            <line
              className="stroke-zinc-950 dark:stroke-white stroke-1 opacity-25"
              x1="0"
              x2="16"
              y1="0.5"
              y2="0.5"
              strokeDasharray="2 2"
              strokeLinejoin="round"></line>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#:S1:)"></rect>
      </svg>
    </div>
  );
};



export default DivideY