import Image from "next/image";
import Link from "next/link";

// MIDDLE LINKS DATA
interface ProductType {
  id: number;
  section: string;
  link: string[];
}

interface Social {
  imgsrc: string;
  href: string;
}

const products: ProductType[] = [
  {
    id: 1,
    section: "Enlaces Útiles",
    link: ['Inicio', 'Comprar Token', 'Lotería', 'Juego Aviator', 'Whitepaper'],
  },
];

const socialLinks: Social[] = [
  { imgsrc: '/images/Footer/insta.svg', href: "https://instagram.com/pinkypromisecoin" },
  { imgsrc: '/images/Footer/twitter.svg', href: "https://twitter.com/pinkypromiseio" },
  { imgsrc: '/images/Footer/telegram.svg', href: "https://t.me/pinkypromisecoin" },
  { imgsrc: '/images/Footer/discord.svg', href: "https://discord.gg/pinkypromise" },
];

const footer = () => {
  return (
    <div className="relative">
      <div className="radial-bg hidden lg:block"></div>
      <div className="mx-auto max-w-2xl mt-64 pb-16 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-24 grid grid-cols-1 gap-y-10 gap-x-16 sm:grid-cols-2 lg:grid-cols-12 xl:gap-x-8">

          {/* COLUMN-1 */}
          <div className='col-span-6'>
            <img
              className="block h-12 w-20px mb-4"
              src={'/images/Logo/logo.svg'}
              alt="PinkyPromise Logo"
            />
            <h3 className='text-lightblue text-sm font-normal leading-9 mb-4 lg:mb-16'>
              PinkyPromise es una plataforma descentralizada en Solana que permite jugar lotería y apostar usando criptomonedas, con tecnología blockchain que garantiza transparencia y seguridad.
            </h3>
            <div className='flex gap-4'>
              {socialLinks.map((items, i) => (
                <Link href={items.href} key={i}><img src={items.imgsrc} alt={`social-${i}`} className='footer-icons' /></Link>
              ))}
            </div>
          </div>

          {/* CLOUMN-2 */}
          {products.map((product) => (
            <div key={product.id} className="group relative col-span-2">
              <p className="text-white text-xl font-medium mb-9">{product.section}</p>
              <ul>
                {product.link.map((link: string, index: number) => (
                  <li key={index} className='mb-5'>
                    <Link href="/" className="text-offwhite text-sm font-normal mb-6 space-links">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* COLUMN-3: CONTACTO */}
          <div className="col-span-4">
            <h3 className="text-white text-xl font-medium mb-9">Contáctanos</h3>
            <h4 className="text-offwhite text-sm font-normal mb-6 flex gap-2">
              <Image src={'/images/Footer/email.svg'} alt="email-icon" width={20} height={20} />
              contacto@pinkypromise.io
            </h4>
            <h4 className="text-offwhite text-sm font-normal mb-6 flex gap-2">
              <Image src={'/images/Footer/address.svg'} alt="address-icon" width={20} height={20} />
              Proyecto global – Comunidad Web3
            </h4>
          </div>

        </div>
      </div>

      {/* All Rights Reserved */}
      <div className='py-8 px-4 border-t border-t-lightblue'>
        <h3 className='text-center text-offwhite'>©2025 – PinkyPromise. Todos los derechos reservados.</h3>
      </div>
    </div>
  );
};

export default footer;
