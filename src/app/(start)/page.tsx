// pages/index.tsx
import Image from 'next/image';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Main Content */}
      <main>
        {/* Portfolio Title */}
        <div className="mb-12">
          <h1 className="text-6xl text-blue-600 font-bold mb-4">Portfolio</h1>
          <div className="bg-lime-400 text-black w-fit px-4 py-1 rounded-full text-sm">
            2023 Edition
          </div>
          <div className="bg-red-400 text-white px-4 py-1 rounded-md w-fit mt-4">
            Graphic Designer
          </div>
        </div>

        {/* Introduction */}
        <div className="flex justify-between items-start mb-16">
          <div className="max-w-xl">
            <h2 className="text-4xl text-blue-600 font-bold mb-6">Hello!</h2>
            <p className="text-blue-900 leading-relaxed">
              It's Marcella! A graphic design student majored in Visual
              Communication Design based in Tangerang. I'm interested in
              challenging myself to gain new knowledges and developing my
              creativity in fun and creative designs. I consider myself as a
              hard-working and easy to adapt. I hope my abilities able to
              contribute to the growth of your firm.
            </p>
            <div className="bg-lime-400 rounded-full px-6 py-2 mt-6 w-fit">
              linkedin.com/in/marcella-aurelia/
            </div>
          </div>
          <div className="relative">
            <Image
              src="/profile.jpg"
              alt="Marcella Aurelia"
              width={200}
              height={200}
              className="rounded-lg"
            />
            <div className="bg-white p-4 rounded-lg mt-4">
              <h3 className="font-medium mb-2">Marcella Aurelia</h3>
              <p className="text-gray-600">Indonesia</p>
              <p className="text-gray-600">@marcellaaurelia_</p>
              <p className="text-gray-600">marcviin02@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Experience & Education */}
        <div className="grid grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl text-blue-600 font-bold mb-6">
              EXPERIENCES
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-gray-600">May 2019 - Jul 2019</p>
                <p className="font-bold">INTERNSHIP</p>
                <p>Designer and Illustrator digima ASIA</p>
                <p>- IT Services and IT Consulting</p>
              </div>
              <div>
                <p className="text-gray-600">2022</p>
                <p className="font-bold">FREELANCER</p>
                <p>Designer at Hitauchi Cafe</p>
                <p>- A Cafe based in Jakarta</p>
              </div>
              <div>
                <p className="text-gray-600">NOW</p>
                <p className="font-bold">FREELANCER & STUDY</p>
                <p>Designer for Social Media,</p>
                <p>Personal Branding Project:</p>
                <p>Brand design, social post, UI/UX design</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl text-blue-600 font-bold mb-6">EDUCATION</h2>
            <div className="space-y-6">
              <div>
                <p className="text-gray-600">2017 - 2020</p>
                <p>Atisa Dipamkara Vocational HighSchool</p>
                <p>Multimedia</p>
              </div>
              <div>
                <p className="text-gray-600">2020</p>
                <p>Multimedia Nusantara University</p>
                <p>Visual Communication Design</p>
              </div>
            </div>
          </div>
        </div>

        {/* Expertise */}
        <div>
          <h2 className="text-2xl text-blue-600 font-bold mb-6">EXPERTISE</h2>
          <div className="flex flex-wrap gap-4">
            <div className="bg-blue-100 px-4 py-2 rounded">Ps</div>
            <div className="bg-orange-100 px-4 py-2 rounded">Ai</div>
            <div className="bg-purple-100 px-4 py-2 rounded">Ae</div>
            <div className="bg-blue-200 px-4 py-2 rounded">Pr</div>
            <div className="bg-pink-500 text-white px-4 py-2 rounded">
              SOCIAL MEDIA
            </div>
            <div className="bg-blue-500 text-white px-4 py-2 rounded">
              Brand Design
            </div>
            <div className="bg-red-500 text-white px-4 py-2 rounded">
              VECTOR ILLUSTRATION
            </div>
            <div className="bg-red-600 text-white px-4 py-2 rounded">
              CREATIVITY
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
