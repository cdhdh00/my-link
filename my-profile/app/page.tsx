export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-8 text-center">
        {/* 프로필 이미지 대신 사용할 원형 아바타 (이름의 첫 글자) */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-900 text-3xl font-bold text-white dark:bg-zinc-100 dark:text-black">
          홍
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            홍길동
          </h1>
          <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            안녕하세요! 바이브 코딩을 배우고 있는 대학생입니다.
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <a
            href="mailto:example@email.com"
            className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-zinc-50 transition-transform hover:scale-105 dark:bg-zinc-50 dark:text-zinc-900"
          >
            Contact
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-zinc-200 bg-white px-6 py-2 text-sm font-medium text-zinc-900 transition-transform hover:scale-105 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          >
            GitHub
          </a>
        </div>
      </main>
    </div>
  );
}
