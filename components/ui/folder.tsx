"use client";

import React from 'react';

const FolderIcon = () => {
  return (
    <section className="relative group flex flex-col items-center justify-center w-full h-full">
      <div className="file relative w-24 h-16 cursor-pointer origin-bottom [perspective:1500px] z-50">
        <div className="work-5 bg-amber-600 w-full h-full origin-top rounded-2xl rounded-tl-none group-hover:shadow-[0_20px_40px_rgba(0,0,0,.2)] transition-all ease duration-300 relative after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-8 after:h-[6px] after:bg-amber-600 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[6px] before:left-[30px] before:w-[6px] before:h-[6px] before:bg-amber-600 before:[clip-path:polygon(0_35%,0%_100%,50%_100%);]" />
        <div className="work-4 absolute inset-0.5 bg-zinc-400 rounded-2xl transition-all ease duration-300 origin-bottom select-none group-hover:[transform:rotateX(-20deg)]" />
        <div className="work-3 absolute inset-0.5 bg-zinc-300 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-30deg)]" />
        <div className="work-2 absolute inset-0.5 bg-zinc-200 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:[transform:rotateX(-38deg)]" />
        <div className="work-1 absolute bottom-0 bg-gradient-to-t from-amber-500 to-amber-400 w-full h-[60px] rounded-2xl rounded-tr-none transition-all ease duration-300 origin-bottom flex items-end group-hover:shadow-[inset_0_20px_40px_#fbbf24,_inset_0_-20px_40px_#d97706] group-hover:[transform:rotateX(-46deg)_translateY(1px)]" />
      </div>
    </section>
  );
};

export default FolderIcon;
