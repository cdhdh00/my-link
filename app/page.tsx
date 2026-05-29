"use client";

import { useState } from "react";
import { dummyLinks, Link } from "../data/links";
import { Card, CardContent } from "@/components/ui/card";
import { LinkAddDialog } from "@/components/link-add-dialog";
import { RiExternalLinkLine } from "@remixicon/react";

export default function Page() {
  const [links, setLinks] = useState<Link[]>(dummyLinks);

  const handleAddLink = (newLink: Link) => {
    setLinks((prev) => [newLink, ...prev]);
  };

  return (
    <div className="flex min-h-svh flex-col items-center p-6 bg-[#F8FAFC] dark:bg-[#0F172A]">
      <div className="w-full max-w-[480px] flex flex-col gap-8 mt-12 pb-20">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white dark:bg-slate-800 shadow-xl mb-2 ring-1 ring-slate-200/50 dark:ring-slate-700/50 transition-transform hover:rotate-3">
            <span className="text-3xl font-black text-primary">M</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            마이링크
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
            모든 링크를 한곳에서 관리하세요
          </p>
        </div>

        {/* Action Section */}
        <LinkAddDialog onAdd={handleAddLink} />

        {/* Links List Section */}
        <div className="flex flex-col gap-4">
          {links.length > 0 ? (
            links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl transition-all"
              >
                <Card className="border-none bg-white dark:bg-slate-900 shadow-sm hover:shadow-md dark:shadow-slate-950/50 transition-all duration-300 ring-1 ring-slate-200/50 dark:ring-slate-800/50 overflow-hidden group-hover:-translate-y-1">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-50 dark:bg-slate-800 flex items-center justify-center ring-1 ring-slate-100 dark:ring-slate-700 group-hover:scale-110 transition-transform duration-300">
                      {link.icon ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={link.icon}
                          alt={`${link.title} 아이콘`}
                          className="w-7 h-7 object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block font-bold text-lg text-slate-800 dark:text-slate-100 truncate group-hover:text-primary transition-colors">
                        {link.title}
                      </span>
                      <span className="block text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        {link.url.replace(/^https?:\/\//, "")}
                      </span>
                    </div>
                    <RiExternalLinkLine 
                      size={18} 
                      className="text-slate-300 dark:text-slate-600 group-hover:text-primary transition-colors flex-shrink-0" 
                    />
                  </CardContent>
                </Card>
              </a>
            )
          )) : (
            <div className="py-20 text-center space-y-3 bg-white/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-400 dark:text-slate-500 font-medium whitespace-pre-wrap">
                등록된 링크가 없습니다.{"\n"}첫 번째 링크를 추가해보세요!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
