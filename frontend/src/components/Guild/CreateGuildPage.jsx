import React from 'react';
import CreateGuild from './CreateGuild';
// import GuildList from './GuildList';

export default function CreateGuildPage() {
  return (
    <div>
      <div className="flex flex-col items-center sm:max-w-md md:max-w-xl lg:max-w-4xl mb-24 pb-4 sm:pb-6 md:pb-10 lg:pb-14 mx-auto bg-no-repeat bg-bottom bg-underline-title bg-contain">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white">Créer une guilde</h1>
      </div>
      <section>
        <CreateGuild />
        {/* <GuildList/> */}
      </section>
    </div>
  );
}