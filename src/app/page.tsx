"use client";

import { ChangeEvent, useMemo, useState } from "react";

type QuestionGroup = {
  title: string;
  color: string;
  questions: string[];
};

const QUESTIONS_PER_STAGE = 12;
const TOTAL_QUESTIONS = 36;
const SECRET_CODE = "gong";

const groups: QuestionGroup[] = [
  {
    title: "Stage 1 · 轻松破冰 (1–12)",
    color: "bg-blue-100",
    questions: [
      "如果可以和全世界任何一个人共进晚餐，你会选谁？",
      "你想出名吗？以何种方式？",
      "打电话前，你会提前排练要说的话吗？为什么？",
      "你心中的完美一天是什么样？",
      "你上次唱歌给自己听是什么时候？给别人听又是什么时候？",
      "如果能活到90岁，并在最后25年保持30岁的心智或身体，你会选哪一个？",
      "你是否有预感自己会怎样死去？",
      "说出三件你和对方共同拥有的特质。",
      "你最感激的一件事是什么？",
      "如果可以改变你成长过程中的一件事，你会改变什么？",
      "用4分钟尽可能详细地讲述你的人生故事。",
      "如果明天醒来你能得到一种新的能力或特质，你希望是什么？",
    ],
  },
  {
    title: "Stage 2 · 情绪深入 (13–24)",
    color: "bg-purple-100",
    questions: [
      "如果一个水晶球能告诉你任何真相，你想知道什么？",
      "有什么事你一直想做但还没做？为什么？",
      "你人生中最重要的成就是什么？",
      "你最珍惜的一段记忆是什么？",
      "你最可怕的记忆是什么？",
      "如果你将在一年内死亡，你会改变现在的生活方式吗？为什么？",
      "友情对你意味着什么？",
      "生命中的爱与温暖扮演什么角色？",
      "轮流说出你认为对方的一个积极特质，共五个。",
      "家庭亲密程度如何？童年比多数人更幸福吗？",
      "你与母亲的关系如何？",
      "说出三句“我们”开头的真实陈述。",
    ],
  },
  {
    title: "Stage 3 · 亲密脆弱 (25–36)",
    color: "bg-rose-100",
    questions: [
      "完成这句：我希望我有一个人可以分享……",
      "如果你想和对方成为亲密朋友，你希望他们知道什么？",
      "告诉对方你喜欢他/她的什么（非常诚实）。",
      "分享你人生中一个尴尬的时刻。",
      "上次在别人面前哭是什么时候？独自哭又是什么时候？",
      "告诉对方你已经喜欢上他/她的什么（更深入）。",
      "有什么事是太严肃不能轻易开玩笑的？",
      "如果今晚你会死，你最遗憾没告诉谁什么？为什么？",
      "房子着火，只能抢一件物品，你会拿什么？为什么？",
      "家人中谁的死亡会让你最难受？为什么？",
      "分享一个个人问题让对方给建议。",
      "交换感受：你认为对方在本次对话中看到了怎样的你？",
    ],
  },
];

const getNumber = (gi: number, qi: number) => gi * QUESTIONS_PER_STAGE + qi + 1;

export default function QuestionsTool() {
  const [maxCount, setMaxCount] = useState(6);
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [topN, setTopN] = useState(10);
  const [secretInput, setSecretInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [secretError, setSecretError] = useState<string | null>(null);

  const questionNumberMap = useMemo(() => {
    return groups.reduce<Record<string, number>>((acc, group, gi) => {
      group.questions.forEach((question, qi) => {
        acc[question] = getNumber(gi, qi);
      });
      return acc;
    }, {});
  }, []);

  const toggleSelect = (question: string) => {
    setSelectedList((prev) => {
      if (prev.includes(question)) {
        return prev.filter((item) => item !== question);
      }
      if (prev.length >= maxCount) {
        return prev;
      }
      return [...prev, question];
    });
  };

  const handleMaxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = parseInt(event.target.value || "0", 10);
    if (Number.isNaN(nextValue) || nextValue <= 0) {
      setMaxCount(1);
      setSelectedList((prev) => prev.slice(0, 1));
      return;
    }
    if (nextValue > TOTAL_QUESTIONS) {
      setMaxCount(TOTAL_QUESTIONS);
      setSelectedList((prev) => prev.slice(0, TOTAL_QUESTIONS));
      return;
    }
    setMaxCount(nextValue);
    setSelectedList((prev) => prev.slice(0, nextValue));
  };

  const handleTopNChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = parseInt(event.target.value || "0", 10);
    if (Number.isNaN(nextValue) || nextValue <= 0) {
      setTopN(1);
      return;
    }
    if (nextValue > TOTAL_QUESTIONS) {
      setTopN(TOTAL_QUESTIONS);
      return;
    }
    setTopN(nextValue);
  };

  const commitCurrentRound = () => {
    if (selectedList.length === 0) return;
    setVoteCounts((prev) => {
      const next = { ...prev };
      selectedList.forEach((question) => {
        next[question] = (next[question] || 0) + 1;
      });
      return next;
    });
    setSelectedList([]);
  };

  const resetAll = () => {
    setSelectedList([]);
    setVoteCounts({});
  };

  const stats = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);
  const topStats = stats.slice(0, Math.min(topN, stats.length));

  const renderQuestionNumber = (question: string) => {
    const num = questionNumberMap[question];
    return typeof num === "number" ? `${num}. ` : "";
  };

  const handleUnlock = () => {
    if (secretInput.trim().toLowerCase() === SECRET_CODE) {
      setIsUnlocked(true);
      setSecretInput("");
      setSecretError(null);
    } else {
      setSecretError("口令不对，再试一次～");
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setSecretInput("");
    setSecretError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-gray-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Workshop Helper
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">
            36 Questions Relationship Tool
          </h1>
          <p className="text-base text-slate-600 md:text-lg">
            心理学验证 · 大家各自勾选五花八门的 n 个问题，系统自动统计，
            最后以票数选出当晚 Top N 深聊题目。
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <span>每轮 / 每人可选问题数 n =</span>
              <input
                type="number"
                min={1}
                max={TOTAL_QUESTIONS}
                value={maxCount}
                onChange={handleMaxChange}
                className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-center"
              />
            </div>
            <div className="flex flex-col gap-2 text-sm text-slate-700 md:flex-row md:items-center">
              <span>
                当前已选{" "}
                <span className="font-semibold text-slate-900">
                  {selectedList.length}
                </span>{" "}
                / {maxCount}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={commitCurrentRound}
                  disabled={selectedList.length === 0}
                  className={`rounded-xl border px-3 py-1 text-sm font-medium transition ${
                    selectedList.length === 0
                      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                      : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  记录这一轮选择
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="rounded-xl border border-rose-200 px-3 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  清空所有记录
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          {groups.map((group, gi) => (
            <div
              key={group.title}
              className={`rounded-2xl border border-slate-200 p-4 shadow-sm ${group.color}`}
            >
              <h2 className="mb-4 text-xl font-semibold text-slate-900">
                {group.title}
              </h2>
              <div className="grid gap-3">
                {group.questions.map((question, qi) => {
                  const number = getNumber(gi, qi);
                  const isSelected = selectedList.includes(question);
                  const votes = voteCounts[question] ?? 0;
                  return (
                    <button
                      key={question}
                      type="button"
                      className={`text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 md:text-base ${
                        isSelected ? "scale-[1.01]" : ""
                      }`}
                      onClick={() => toggleSelect(question)}
                      onDoubleClick={() =>
                        setPreview(`${number}. ${question}`)
                      }
                    >
                      <div
                        className={`flex flex-col gap-1 rounded-2xl border-2 bg-white p-3 shadow ${
                          isSelected
                            ? "border-blue-500 shadow-blue-100"
                            : "border-transparent hover:border-slate-200"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="w-7 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {number}.
                          </span>
                          <span className="flex-1 text-slate-900">
                            {question}
                          </span>
                          {isSelected && (
                            <span role="img" aria-label="selected">
                              ✅
                            </span>
                          )}
                        </div>
                        {votes > 0 && (
                          <div className="pl-9 text-xs text-slate-500">
                            当前累计：{votes} 票
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            当前这一轮选中的问题（可复制发群里）
          </h3>
          {isUnlocked ? (
            <>
              {selectedList.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  这一轮还没有选择任何问题，点击上面的卡片即可勾选～
                </p>
              ) : (
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-800 md:text-base">
                  {selectedList.map((question) => (
                    <li key={question}>
                      {renderQuestionNumber(question)}
                      {question}
                    </li>
                  ))}
                </ol>
              )}
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-500">
              该区域已隐藏，主持人输入口令后才会显示。
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">
              最终统计结果（所有轮次累计）
            </h3>
            <span className="text-sm text-slate-500">
              · 用于选出当晚 Top N 深聊题目
            </span>
          </div>

          {!isUnlocked ? (
            <div className="space-y-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm">
              <p className="text-slate-600">
                统计结果已上锁。主持人输入口令 <code className="rounded bg-slate-200 px-1">gong</code>{" "}
                后即可查看。
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="password"
                  value={secretInput}
                  onChange={(event) => {
                    setSecretInput(event.target.value);
                    setSecretError(null);
                  }}
                  className="flex-1 min-w-[160px] rounded-lg border border-slate-300 px-3 py-1"
                  placeholder="输入口令"
                />
                <button
                  type="button"
                  onClick={handleUnlock}
                  className="rounded-xl bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                >
                  解锁
                </button>
              </div>
              {secretError && (
                <p className="text-sm text-rose-500">{secretError}</p>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
                <span>当晚 Top N =</span>
                <input
                  type="number"
                  min={1}
                  max={TOTAL_QUESTIONS}
                  value={topN}
                  onChange={handleTopNChange}
                  className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-center"
                />
                <span className="text-xs text-slate-500">
                  （会按票数自动取前 N 个）
                </span>
                <button
                  type="button"
                  onClick={handleLock}
                  className="ml-auto rounded-xl border border-slate-200 px-3 py-1 text-xs text-slate-500 hover:bg-slate-100"
                >
                  重新上锁
                </button>
              </div>
              {stats.length === 0 ? (
                <p className="text-sm text-slate-500">
                  还没有任何记录。让每个人选完一轮后，点“记录这一轮选择”，这里就会显示最受欢迎的问题。
                </p>
              ) : (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    当晚 Top {Math.min(topN, stats.length)} 深聊题目
                  </h4>
                  <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-slate-800 md:text-base">
                    {topStats.map(([question, count]) => (
                      <li key={question}>
                        {renderQuestionNumber(question)}
                        {question}{" "}
                        <span className="text-xs text-slate-500">
                          （{count} 票）
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-xl font-semibold text-slate-900">
              问题预览
            </h3>
            <p className="mb-6 whitespace-pre-line text-slate-700">{preview}</p>
            <button
              type="button"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              onClick={() => setPreview(null)}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
