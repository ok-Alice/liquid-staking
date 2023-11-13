export default function NotFound() {
  return (
    <div className="font-sans flex-grow text-center flex flex-col items-center justify-center">
      <div>
        <h1 className="next-error-h1 inline-block mr-5 p-0 text-2xl font-medium align-top leading-[49px]">
          404
        </h1>
        <div className="inline-block">
          <h2 className="text-base font-normal leading-[49px] m-0">
            This page could not be found.
          </h2>
        </div>
      </div>
    </div>
  );
}
