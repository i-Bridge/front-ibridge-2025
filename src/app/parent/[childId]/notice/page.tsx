import MailBox from './_components/MailBox';

export default async function NoticePage() {
  // params가 Promise이므로, await를 사용해 값을 추출

  return (
    <div>
      <MailBox />
    </div>
  );
}
