// 포도알 페이지
// app/child/[childId]/reward/page.tsx
export default function RewardPage() {
  const mock = [
    { id: 1, name: '스티커 팩', count: 2 },
    { id: 2, name: '에너지 포션', count: 1 },
  ];

  return (
    <section className="p-2">
      <h2 className="text-xl font-bold">리워드</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mock.map((it) => (
          <div
            key={it.id}
            className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"
          >
            <div className="font-semibold">{it.name}</div>
            <div className="opacity-70 text-sm">x {it.count}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
