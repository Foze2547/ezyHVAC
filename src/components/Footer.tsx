import React, { useState } from 'react';
import { useLanguage } from "../contexts/LanguageContext";

const Footer = () => {
  const { lang } = useLanguage();
  const [qrError, setQrError] = useState(false);

  const text = {
    en: {
      desc1: "ezyHVAC is a website dedicated to calculating HVAC (Heating, Ventilation, and Air Conditioning) and Mechanical systems calculations.",
      desc2: "Version 1.1.2",
      universityName: "UNIVERSITY OF PHAYAO",
      bankName: "KKP 2053388241 นพรัตน์ เกตุขาว",
      qrCodeAlt: "QR Code for Donation",
      q: 'Donate for server costs and support education.',
      scanQr: 'Scan QR Code for donation',
      paypalDonation: 'Wise Donation',
      thaiBank: 'KKP Bank',
    },
    th: {
      desc1: "ezyHVAC is a website dedicated to calculating HVAC (Heating, Ventilation, and Air Conditioning) and Mechanical systems calculations.",
      desc2: "Version 1.1.2",
      universityName: "มหาวิทยาลัยพะเยา",
      bankName: "KKP 2053388241 นพรัตน์ เกตุขาว",
      qrCodeAlt: "QR Code สำหรับการบริจาค",
      q: 'บริจาคสำหรับค่า Server และ สนับสนุนการศึกษา',
      scanQr: 'สแกน QR Code เพื่อบริจาค',
      paypalDonation: 'บริจาคผ่าน PayPal',
      thaiBank: 'ธนาคารเกียรตินาคิน',
    },
  };
  const paypalUrl = "https://wise.com/pay/me/nopparatk20";
  return (
    <footer className="bg-indigo-600 text-white py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 items-start md:items-center"> 
          <div className="text-left md:text-left "> 
            <p className="text-sm">
              {text[lang].desc1}
            </p>
            <p className="text-sm">Give feedback or get the Excel file in full SI and I-P Units:<ul>
            <p>Email: nopparat.ka@up.ac.th</p>
            <li>Facebook: <a href="https://www.facebook.com/ezyHVAC" target="_blank" rel="noopener">https://www.facebook.com/ezyHVAC</a></li>
            </ul></p>
            <p className="text-sm">
              {text[lang].desc2}
            </p>
            <p className="text-sm">
              &copy; 2025 ezyHVAC All Rights Reserved.
            </p>
          </div>
          <div className="flex flex-col items-center text-center"> 
            <div className="bg-indigo-800/30 rounded-lg p-4 border border-indigo-400/20 w-full">
              <p className="text-sm text-indigo-100 leading-relaxed mb-4">
                {text[lang].q}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-indigo-200 mb-2">{text[lang].thaiBank}</h4>
                  <div className="bg-indigo-900/40 rounded-lg p-3 border border-indigo-300/20">
                    <p className="text-xs font-mono text-indigo-50 font-bold tracking-wider">
                      KKP 2053388241 
                    </p>
                    <p className="text-xs text-white font-medium mt-1">
                      Nopparat Katkhaw
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-16 bg-indigo-400/30"></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-indigo-200 mb-2">{text[lang].paypalDonation}</h4>
                  <div className="bg-white rounded-lg p-2 inline-block">
                    {!qrError ? (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(paypalUrl)}`}
                        alt={text[lang].qrCodeAlt}
                        className="w-20 h-20 object-contain"
                        onError={() => setQrError(true)}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-indigo-100 rounded flex flex-col items-center justify-center text-indigo-600 text-xs font-bold">
                        <div>📱</div>
                        <div>PayPal</div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-indigo-200 mt-1">{text[lang].scanQr}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end text-center md:text-right"> 
            <a href="https://www.eng.up.ac.th/" className="block hover:opacity-80 transition-opacity duration-300">
              <img
                src="https://www.eng.up.ac.th/images/LOGO190865.png"
                alt={text[lang].universityName}
                className="w-max h-15 mb-1 transition-transform duration-300 hover:scale-105" 
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;