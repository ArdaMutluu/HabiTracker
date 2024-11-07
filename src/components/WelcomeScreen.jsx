import React, { useState } from 'react';
import bg from '../assets/bg.jpg';
import { TextGenerateEffect } from './ui/text-generate-effect';

const words = `“I say never be complete, I say stop being perfect, I say let... lets evolve, let the chips fall where they may.”`;
const welcome = `WELCOME TO THE WINTER ARC`;

const WelcomeScreen = () => {
   return (
    <div className='bg-gradient-to-tr from-purple-300 to-green-800 h-96 w-full relative'>
      <img
        src={bg}
        className='w-full h-full object-cover mix-blend-overlay'
        alt="Background"
      />
      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        <TextGenerateEffect
          duration={3}
          filter={false}
          words={words}
        />
        
        <TextGenerateEffect
          duration={9}
          filter={false}
          words={welcome}
        />
      </div>
    </div>
  );
}

export default WelcomeScreen;
