import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <>
    <div class="py-4 border-t border-gray-200">
    <div class="flex items-center justify-center flex-col gap-2 lg:gap-0 lg:flex-row lg:justify-between mx-28 font-bold">
    <a href='https://www.linkedin.com/in/nikunj-kadu-45a3b7292/' target='_blank'> Made with ❤️ by Nikunj Kadu</a>
        <div class="flex mt-4 space-x-4 sm:justify-center sm:mt-0 ">


            <a href="https://www.linkedin.com/in/nikunj-kadu-45a3b7292/"
                class="w-9 h-9 rounded-full bg-slate-700 flex justify-center items-center hover:bg-indigo-600" target='_blank'>
                <svg class="w-[1rem] h-[1rem] text-white" viewBox="0 0 13 12" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M2.8794 11.5527V3.86835H0.318893V11.5527H2.87967H2.8794ZM1.59968 2.81936C2.4924 2.81936 3.04817 2.2293 3.04817 1.49188C3.03146 0.737661 2.4924 0.164062 1.61666 0.164062C0.74032 0.164062 0.167969 0.737661 0.167969 1.49181C0.167969 2.22923 0.723543 2.8193 1.5829 2.8193H1.59948L1.59968 2.81936ZM4.29668 11.5527H6.85698V7.26187C6.85698 7.03251 6.87369 6.80255 6.94134 6.63873C7.12635 6.17968 7.54764 5.70449 8.25514 5.70449C9.18141 5.70449 9.55217 6.4091 9.55217 7.44222V11.5527H12.1124V7.14672C12.1124 4.78652 10.8494 3.68819 9.16483 3.68819C7.78372 3.68819 7.17715 4.45822 6.84014 4.98267H6.85718V3.86862H4.29681C4.33023 4.5895 4.29661 11.553 4.29661 11.553L4.29668 11.5527Z"
                        fill="currentColor"></path>
                </svg>

            </a>
            <a href="https://github.com/nk112233"
                class="w-9 h-9 rounded-full bg-gray-700 flex justify-center items-center hover:bg-indigo-600" target='_blank'>
              <svg class="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd" />
              </svg>

            </a>
        </div>
    </div>
</div>
          
          </>
  );
};

export default Footer;