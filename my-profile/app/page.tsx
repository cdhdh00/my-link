import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFCE0] font-sans text-black selection:bg-[#FF90E8] selection:text-black">
      {/* Navigation / Header */}
      <nav className="flex items-center justify-between border-b-4 border-black bg-white px-6 py-4 md:px-12">
        <div className="text-2xl font-black uppercase tracking-tighter">
          Hong_Gildong
        </div>
        <div className="hidden space-x-6 md:flex">
          <a href="#about" className="font-bold border-b-2 border-transparent hover:border-black transition-colors">About</a>
          <a href="#skills" className="font-bold border-b-2 border-transparent hover:border-black transition-colors">Skills</a>
          <a href="#projects" className="font-bold border-b-2 border-transparent hover:border-black transition-colors">Projects</a>
        </div>
        <a 
          href="mailto:example@email.com"
          className="border-4 border-black bg-[#FF90E8] px-6 py-2 font-bold shadow-[4px_4px_0_0_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000]"
        >
          LET'S TALK
        </a>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12 md:px-12 md:py-24">
        {/* Hero Section */}
        <section className="mb-24 flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-16">
          <div className="flex-1 space-y-6">
            <h1 className="text-6xl font-black uppercase leading-[1.1] tracking-tighter md:text-8xl lg:text-9xl">
              VIBE<br />
              <span className="bg-[#38DBFF] px-2 border-4 border-black shadow-[8px_8px_0_0_#000]">CODING</span>
            </h1>
            <p className="max-w-xl text-xl font-medium leading-relaxed border-l-4 border-black pl-4">
              안녕하세요! 바이브 코딩을 배우고 있는 대학생 홍길동입니다. 
              거칠고 투박하지만 직관적인 네오브루탈리즘(Neobrutalism) 스타일로 세상을 만듭니다.
            </p>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 translate-x-4 translate-y-4 bg-black"></div>
            <div className="relative border-4 border-black bg-[#FFC900] p-12 text-center">
              <h2 className="text-4xl font-black uppercase">Building</h2>
              <h2 className="text-4xl font-black uppercase mb-4">The Web</h2>
              <div className="inline-block border-4 border-black bg-white px-8 py-4 font-black text-2xl uppercase shadow-[8px_8px_0_0_#000] -rotate-3 hover:rotate-0 transition-transform">
                One block at a time
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-24">
          <h2 className="mb-12 text-5xl font-black uppercase border-b-4 border-black pb-4 inline-block">Tech Stack</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Next.js 16', color: 'bg-[#FF90E8]' },
              { name: 'React 19', color: 'bg-[#38DBFF]' },
              { name: 'Tailwind 4', color: 'bg-[#FFC900]' },
              { name: 'TypeScript', color: 'bg-[#90A8ED]' },
            ].map((skill, index) => (
              <div 
                key={index} 
                className={`border-4 border-black ${skill.color} p-8 shadow-[8px_8px_0_0_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_#000]`}
              >
                <h3 className="text-2xl font-black uppercase">{skill.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Preview */}
        <section id="projects" className="mb-24">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex-1 border-4 border-black bg-white p-8 shadow-[12px_12px_0_0_#000]">
              <div className="border-4 border-black bg-[#90A8ED] h-48 mb-6"></div>
              <h3 className="text-3xl font-black mb-4">Project Alpha</h3>
              <p className="font-bold mb-6">네오브루탈리즘 UI가 적용된 첫 번째 포트폴리오 프로젝트.</p>
              <button className="border-4 border-black bg-[#FFC900] px-6 py-3 font-bold uppercase shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[0px_0px_0_0_#000] transition-all">
                View Project
              </button>
            </div>
            <div className="flex-[0.7] border-4 border-black bg-[#38DBFF] p-8 shadow-[12px_12px_0_0_#000] flex flex-col justify-center items-center text-center">
              <h3 className="text-4xl font-black uppercase mb-4">More Coming Soon!</h3>
              <p className="font-bold text-xl">Stay tuned for updates.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-[#FF90E8] p-12 text-center md:p-24">
        <h2 className="mb-8 text-6xl font-black uppercase tracking-tighter md:text-8xl">Let's Connect</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border-4 border-black bg-white px-12 py-6 text-2xl font-black uppercase shadow-[8px_8px_0_0_#000] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-[0px_0px_0_0_#000]"
          >
            GitHub
          </a>
          <a
            href="mailto:example@email.com"
            className="border-4 border-black bg-black text-[#FFFCE0] px-12 py-6 text-2xl font-black uppercase shadow-[8px_8px_0_0_#FFF] transition-all hover:translate-x-2 hover:translate-y-2 hover:shadow-[0px_0px_0_0_#FFF]"
          >
            Email Me
          </a>
        </div>
      </footer>
    </div>
  );
}
