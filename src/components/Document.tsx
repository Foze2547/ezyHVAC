import React, { FC, ButtonHTMLAttributes, HTMLAttributes, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Code, Smartphone, Link, FileText, Globe, ShoppingCart, Eye, UserCheck, Download, ChevronDown, ChevronUp, FileEdit, Facebook ,LayoutPanelTop } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface BookData {
    title: string;
    desc: string;
    imageText: string;
    image: string;
    buyLink: string;
    previewLink?: string;
    correctionLink?: { text: string; url: string };
    highlights: string[];
    tableOfContents: string[];
}

interface PersonnelData {
    name: string;
    title: string;
    intro: string;
    image: string;
}

interface SoftwareData {
    title: string;
    image: string;
    version: string;
    price: string[];
    features: string[];
    systemRequirements: string[];
    manualLinks?: { label: string; url: string }[];
    demoLink?: string;
    websiteLink?: string;
}

interface MobileAppData {
    title: string;
    desc: string;
    image: string;
    iosVersion: string;
    androidVersion: string;
    features: string[];
    compatibility: string;
    requirements: string[];
    appStoreLink: string;
    googlePlayLink: string;
}

// --- Data Section (English Only) ---

const books: BookData[] = [
    {
        title: "Air Conditioning Book 1 (Digital B&W)",
        desc: "ISBN 9786166035803 | 660 Pages. The best-selling AC book with over 4,000 copies sold. | Price: 500 THB",
        imageText: "Cover of Air Conditioning Book 1",
        image: "/doc/air1.png",
        buyLink: "https://www.facebook.com/UP.Energy4You",
        correctionLink: { text: "Correction Sheet 1st Print", url: "https://www.facebook.com/media/set/?set=a.653315266838177&type=3" },
        highlights: [],
        tableOfContents: []
    },
    {
        title: "Air Conditioning Book 2 (4-Color Print)",
        desc: "ISBN 9786166234879 | 264 Pages. Focuses on practical applications and installation. | Price: 500 THB",
        imageText: "Cover of Air Conditioning Book 2",
        image: "/doc/air2.png",
        buyLink: "https://www.facebook.com/UP.Energy4You",
        highlights: [],
        tableOfContents: []
    },
];

const ebooks: { title: string; highlights: string[]; tableOfContents: string[] }[] = [
    {
        title: "Details for Air Conditioning E-Book 1",
        highlights: [
            "Considered the best air conditioning book in 30 years.",
            "Over 4,000 copies sold.",
            "Written from over 20 years of direct experience in design and teaching.",
            "References standards from ASHRAE Handbooks, SMACNA, and CARRIER."
        ],
        tableOfContents: [
            "Chapter 1: Psychrometrics and Comfort",
            "Chapter 2: Heat and Humidity Load Calculation",
            "Chapter 3: Condensation and Insulation",
            "Chapter 4: Air Distribution Design",
            "Chapter 5: Water Piping System Design",
            "Chapter 6: Refrigerants and System Components",
            "Chapter 7: Equipment, Systems, and Controls",
            "Chapter 8: Air System Management",
            "Chapter 9: Efficiency and Energy Use of Air Conditioning Systems"
        ]
    },
    {
        title: "Details for Air Conditioning E-Book 2",
        highlights: [
            "Written by a team of professional engineers with hands-on experience in installation and supervision.",
            "Focuses on practical application and installation, not complex calculations."
        ],
        tableOfContents: [
            "Chapter 1: VRF Systems",
            "Chapter 2: Heat Pumps",
            "Chapter 3: Humidity and Air Quality Control",
            "Chapter 4: Installation of Air Conditioning Systems",
            "Chapter 5: Determining Equipment Cooling Load",
            "Chapter 6: Electrical Protection in Air Conditioning Systems"
        ]
    },
];

const software: SoftwareData[] = [
    {
        title: "ezyPipeCal v.excel",
        version: "1.1.3",
        price: ["Price: 499 Baht, promotion 199 Baht"],
        features: [
            "Pipe flow pressure Loss calculations",
            "Pump head calculations",
            "Chilled water and Condenser water, Plumbing and Sanitary system",
            "PPR, PVC, Steel, Galvanize, HDPE Pipe",
            "There is a guideline for pipe size selection",
            "The C value can be adjusted based on material type and application",
            "NPSHa Calculation",
            "Motor size recommendation"
        ],
        systemRequirements: [
            "Microsoft Excel version 2021 or 365 is recommended for optimal performance compared to earlier versions."
        ],
        manualLinks: [{ label: "Manual Download", url: "https://drive.google.com/file/d/1C-jsdEbaYGnvvz0hCjTy0rbTjJ2_1fWP/view  " }],
        demoLink: "https://drive.google.com/drive/folders/1xMg2l0wfwEs1F-aASwAWi0WfJvyCU7Ts?usp=sharing",
        image: "/doc/ezypipe1.png"
    },
    {
        title: "ezyDuct v.excel",
        version: "1.4",
        price: ["Price: 990 Baht, promotion 649 Baht",],
        features: [
            "Duct design",
            "Pressure loss calculations",
            "Duct sizing",
            "The material roughness value can be adjusted",
            "Available 2 in SI and I-P units"
        ],
        systemRequirements: ["Microsoft excels version 2021 or 365 or later"],
        manualLinks: [
            { label: "Manual Download SI-units", url: "https://drive.google.com/file/d/1YHDMmlSY6xz89BYjyDdmg_WISJaBZN8z/view" },
            { label: "Manual Download I-P units", url: "https://drive.google.com/file/d/1y-3c83_pduXANscvXDeakCHIsLvCoHte/view" }
        ],
        demoLink: "https://drive.google.com/drive/folders/1xMg2l0wfwEs1F-aASwAWi0WfJvyCU7Ts",
        image: "/doc/ezyduct.png"
    },
    {
        title: "Duct Master",
        version: "V1.0.1",
        price: [ "Duct Master is available in three subscription tiers",
        "Free 0 Baht. Includes 5 layouts that expire in 24 hours.",
        "5-Layout 500 Baht. Includes 5 layouts.",
        "15-Layout 1,000 Baht. Includes 15 layouts.", ],
        features: [
        " Duct Master is a powerful and versatile tool for designing and optimizing duct systems.",
        "It's an ideal choice for engineers, contractors, and anyone involved in ductwork design and analysis due to its cloud-based accessibility, user-friendly interface, and comprehensive features."
        ],
        systemRequirements: [
            "Microsoft Excel version 2021 or 365 is recommended for optimal performance compared to earlier versions."
        ],
        manualLinks: [{ label: "Official Website", url: "https://ductcal.com/" }],
        websiteLink: "https://app.ductcal.com/#/login",
        image: "/doc/DuctM.png"
    },
];

const mobileApps: MobileAppData[] = [
    {
        title: "Duct Sizer",
        desc: "The Duct Sizer is a productivity app developed by Noparat Katkhaw. The app is a simplest and quickest ductulator.",
        image: "/doc/Ductsize.png",
        iosVersion: "1.0.6",
        androidVersion: "0.2",
        features: [
            "Perform quick calculation and accurate results.",
            "Use the finger slide for quick calculations.",
            "Shows equivalent round and rectangular duct sizes."
        ],
        compatibility: "Compatible with: I-P, SI and JP units.",
        requirements: ["iOS 12.0 or later", "Android 7.0 and up"],
        appStoreLink: "https://apps.apple.com/th/app/ductsizer/id6467117263",
        googlePlayLink: "https://play.google.com/store/apps/details?id=com.Energy4You.DuctSizer"
    },
    {
        title: "Pipe Sizer",
        desc: "The Pipe Sizer is a productivity app developed by Noparat Katkhaw. The app is a simplest and quickest pipe sizing.",
        image: "/doc/pipeSize.png",
        iosVersion: "1.0.6",
        androidVersion: "0.2",
        features: [
            "Perform quick calculation and accurate results.",
            "Use the finger slide for quick calculations.",
            "Shows Steel, PVC, HDPE, and PPR pipe sizes for any schedule or class."
        ],
        compatibility: "Compatible with: I-P, SI and JP units.",
        requirements: ["iOS 12.0 or later", "Android 7.0 and up"],
        appStoreLink: "https://apps.apple.com/th/app/pipesizer/id6471234725?l=th",
        googlePlayLink: "https://play.google.com/store/apps/details?id=com.Energy4You.PipeSizer"
    }
];

const personnel: PersonnelData[] = [
    {
        name: "Asst. Prof. DR. Noparat Ketkaew",
        title: "Consultant and design",
        intro: "With over 20 years of mechanical engineering experience, authoring books and developing tools to transfer knowledge to professionals and the next generation.",
        image: "/doc/pd1.jpg"
    },

    {
        name: "Dr. Ratchaneewan Angkurabutr",
        title: "Consultant and design",
        intro: "Experience in mechanical engineering, with expertise in renewable energy, energy conservation, and applying technology to improve system efficiency.",
        image: "/doc/pd.jpg"
    },
];

const BookDetails: FC<{ book: { highlights: string[]; tableOfContents: string[] } }> = ({ book }) => {
    if (book.highlights.length === 0 && book.tableOfContents.length === 0) {
        return null;
    }
    return (
        <div className="px-4 pb-4 text-xs text-gray-600 bg-white border-t border-gray-200">
            {book.highlights.length > 0 && (
                <div className="pt-3">
                    <h5 className="text-gray-700 mb-1">Highlights</h5>
                    <ul className="list-disc list-inside space-y-1">
                        {book.highlights.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
            )}
            {book.tableOfContents.length > 0 && (
                 <div className="pt-3">
                    <h5 className="text-gray-700 mb-1">Table of Contents</h5>
                    <ul className="list-decimal list-inside space-y-1">
                        {book.tableOfContents.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};


const DocumentPage: FC = () => {
    const [expandedBook, setExpandedBook] = useState<number | null>(null);
    const [expandedEbook, setExpandedEbook] = useState<number | null>(null);

    const toggleBookDetails = (index: number) => {
        setExpandedBook(expandedBook === index ? null : index);
    };

    const toggleEbookDetails = (index: number) => {
        setExpandedEbook(expandedEbook === index ? null : index);
    };

    return (
        <div className="p-4 md:p-6 bg-white min-h-screen font-sans text-gray-800">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-2xl md:text-3xl mb-2">Engineering Solutions and Tools</h1>
                    <p className="text-base text-gray-500"></p>
                    <h2 className="text-xl md:text-2xl text-center mb-8">Products and Services</h2>
                </header>
                

                {/* Books Section */}
                <section className="mb-12">
                    <h3 className="text-lg mb-4 flex items-center gap-2"><Book className="w-5 h-5 text-blue-600" /> Books and Manuals</h3>
                    <div className="space-y-6">
                        {books.map((book, index) => (
                            <Card key={index} className="bg-gray-50 border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-none">
                                <div className="grid grid-cols-1 md:grid-cols-3">
                                    <div className="md:col-span-1">
                                        <img
                                            src={book.image}
                                            alt={book.imageText}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="md:col-span-2 p-4 flex flex-col">
                                        <h4 className="text-base mb-2">{book.title}</h4>
                                        <p className="text-gray-600 text-xs flex-grow mb-3">{book.desc}</p>
                                        <div className="mt-auto flex flex-col sm:flex-row gap-2 flex-wrap">
                                            {book.previewLink && (
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 text-xs"
                                                    onClick={() => window.open(book.previewLink, '_blank')}
                                                >
                                                    <Eye className="mr-2 h-4 w-4" /> Preview
                                                </Button>
                                            )}
                                            <Button 
                                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                                onClick={() => window.open(book.buyLink, '_blank')}
                                            >
                                                <ShoppingCart className="mr-2 h-4 w-4" /> Buy Now
                                            </Button>
                                            {book.correctionLink && (
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 text-xs"
                                                    onClick={() => window.open(book.correctionLink.url, '_blank')}
                                                >
                                                    <FileEdit className="mr-2 h-4 w-4" /> {book.correctionLink.text}
                                                </Button>
                                            )}
                                             {(book.highlights.length > 0 || book.tableOfContents.length > 0) && (
                                                <Button 
                                                    variant="outline" 
                                                    className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 text-xs"
                                                    onClick={() => toggleBookDetails(index)}
                                                >
                                                    {expandedBook === index ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
                                                    Details
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {expandedBook === index && <BookDetails book={book} />}
                            </Card>
                        ))}
                    </div>
                </section>
                
                <section className="mb-12">
                    <h3 className="text-lg mb-4 flex items-center gap-2"><Book className="w-5 h-5 text-green-500" /> E-books</h3>
                     <Card className="bg-gray-50 border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-none">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="md:col-span-1">
                                <img src="/doc/ebook12.png" alt="E-book cover" className="w-full h-full object-cover" />
                            </div>
                            <div className="md:col-span-2 p-4 flex flex-col justify-center">
                                <p className="text-gray-600 text-sm mb-4">Learn anytime, anywhere with our practical and easy-to-understand E-books.</p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button variant="outline" onClick={() => window.open('https://www.mebmarket.com/index.php?action=search_book&type=all&search=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8&auto_search_id=&page_no=1', '_blank')} className="w-full sm:w-auto text-xs bg-green-500 hover:bg-green-600 text-white">Buy on MEB</Button>
                                    <Button variant="outline" onClick={() => window.open('https://www.chulabook.com/ebooks?text=%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%9B%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B2%E0%B8%81%E0%B8%B2%E0%B8%A8&reload=1', '_blank')} className="w-full sm:w-auto text-xs bg-pink-500 hover:bg-pink-600 text-white">Buy on CU E-book</Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card className="bg-gray-50 border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-none mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="md:col-span-1">
                                <img src="/doc/air3.png" alt="Cover of Piping System Design" className="w-full h-full object-cover" />
                            </div>
                            <div className="md:col-span-2 p-4 flex flex-col">
                                <h4 className="text-base mb-2">Air Conditioning and Ventilation</h4>
                                <p className="text-gray-600 text-xs flex-grow mb-3">The book “Air Conditioning and Ventilation: From Fundamentals to Practice” in English is an extended development of the highly popular Thai edition “การปรับอากาศ 1”, which has already sold more than 4,000 copies.

Key features of this English edition include:

Comprehensive calculation examples in both SI and I-P units:
This edition expands the scope of worked examples by incorporating both International System of Units (SI) and Inch-Pound (I-P) units, providing readers with a more complete resource for understanding and applying concepts in diverse contexts.

An excellent option for English language practice:
Whether readers are students seeking to enhance their English reading skills in engineering topics or professionals aiming to acquire technical HVAC terminology in English, this book serves as an ideal learning tool.

Improved accuracy and clarity:
All potential ambiguities or errors identified in the original “Air Conditioning 1” Thai edition have been carefully reviewed and corrected to ensure accuracy and provide a smoother reading experience.

This volume stands as an essential reference for advancing knowledge and expertise in air conditioning and ventilation.</p>
                                <div className="mt-auto flex flex-col sm:flex-row gap-2 flex-wrap">
                                    <Button 
                                        variant="outline" 
                                        className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100 text-xs"
                                        onClick={() => window.open("/doc/Book content.pdf", '_blank')}
                                    >
                                        <Eye className="mr-2 h-4 w-4" /> Preview
                                    </Button>
                                    <Button 
                                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                        onClick={() => window.open("https://www.mebmarket.com/ebook-371151-Air-Conditioning-and-Ventilation", '_blank')}
                                    >
                                        <ShoppingCart className="mr-2 h-4 w-4" /> Buy Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <div className="space-y-2 mt-4">
                        {ebooks.map((ebook, index) => (
                            <Card key={index} className="bg-gray-50 border border-gray-200 rounded-none">
                                <button
                                    className="w-full p-3 flex justify-between items-center text-left text-sm"
                                    onClick={() => toggleEbookDetails(index)}
                                >
                                    <span>{ebook.title}</span>
                                    {expandedEbook === index ? <ChevronUp /> : <ChevronDown />}
                                </button>
                                {expandedEbook === index && <BookDetails book={ebook} />}
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mb-12">
                    <h3 className="text-lg mb-4 flex items-center gap-2"><Code className="w-5 h-5 text-gray-700" /> Calculation Software</h3>
                    <div className="space-y-6">
                        {software.map((sw, index) => (
                            <Card key={index} className="bg-gray-50 border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-none">
                                <div className="grid grid-cols-1 md:grid-cols-3">
                                    <div className="md:col-span-1">
                                        <img src={sw.image} alt={`Screenshot of ${sw.title}`} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="md:col-span-2 p-4">
                                        <h4 className="text-base mb-2">{sw.title}</h4>
                                        <div className="text-xs text-gray-600 space-y-2">
                                            <p>Version: {sw.version}</p>
                                            <p>{sw.price}</p>
                                            <div>
                                                <p className="text-gray-700">Features:</p>
                                                <ul className="list-disc list-inside pl-2">
                                                    {sw.features.map((feature, i) => <li key={i}>{feature}</li>)}
                                                </ul>
                                            </div>
                                            <div>
                                                <p className="text-gray-700">System Requirements:</p>
                                                <ul className="list-disc list-inside pl-2">
                                                    {sw.systemRequirements.map((req, i) => <li key={i}>{req}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                         <div className="mt-3 flex flex-col sm:flex-row gap-2 flex-wrap">
                                            {sw.manualLinks.map((link, i) => (
                                                <Button key={i} variant="outline" onClick={() => window.open(link.url, '_blank')} className="w-full sm:w-auto text-xs">
                                                   <Download className="mr-2 h-4 w-4" /> {link.label}
                                                </Button>
                                            ))}
                                            {sw.demoLink && (
                                             <Button variant="outline" onClick={() => window.open(sw.demoLink, '_blank')} className="w-full sm:w-auto text-xs">
                                               <Download className="mr-2 h-4 w-4" /> Demo-version
                                            </Button>
                                            )}

                                            {sw.websiteLink && (
                                                <Button variant="outline" onClick={() => window.open(sw.websiteLink!, '_blank')} className="w-full sm:w-auto text-xs">
                                                   <Globe className="mr-2 h-4 w-4" /> Go to Website
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mb-12">
                    <h3 className="text-lg mb-4 flex items-center gap-2"><Smartphone className="w-5 h-5 text-gray-700" /> Mobile Applications</h3>
                    <div className="space-y-6">
                        {mobileApps.map((app, index) => (
                            <Card key={index} className="bg-gray-50 border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-none">
                                <div className="grid grid-cols-1 md:grid-cols-3">
                                    <div className="md:col-span-1">
                                        <img src={app.image} alt={`Screenshot of ${app.title}`} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="md:col-span-2 p-4">
                                        <h4 className="text-base mb-2">Application: {app.title}</h4>
                                        <div className="text-xs text-gray-600 space-y-2">
                                            <p>iOS Version: {app.iosVersion} | Android Version: {app.androidVersion}</p>
                                            <div>
                                                <p className="text-gray-700">Features:</p>
                                                <ul className="list-disc list-inside pl-2">
                                                    {app.features.map((feature, i) => <li key={i}>{feature}</li>)}
                                                </ul>
                                            </div>
                                            <p>Compatibility: {app.compatibility}</p>
                                            <div>
                                                <p className="text-gray-700">System Requirements:</p>
                                                <ul className="list-disc list-inside pl-2">
                                                    {app.requirements.map((req, i) => <li key={i}>{req}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                         <div className="mt-3 flex flex-col sm:flex-row gap-2">
                                            <Button variant="outline" onClick={() => window.open(app.appStoreLink, '_blank')} className="w-full sm:w-auto text-xs">
                                               <Download className="mr-2 h-4 w-4" /> Download App (iOS)
                                            </Button>
                                             <Button variant="outline" onClick={() => window.open(app.googlePlayLink, '_blank')} className="w-full sm:w-auto text-xs">
                                               <Download className="mr-2 h-4 w-4" /> Download App (Android)
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mb-10">
                     <h3 className="text-xl text-center mb-6">Personnel</h3>
                     <div className="space-y-6 max-w-2xl mx-auto">
                         {personnel.map((person, index) => (
                             <Card key={index} className="bg-gray-50 border-gray-200 overflow-hidden rounded-none">
                                <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                                    <div className="md:col-span-1">
                                        <img src={person.image} alt={`Picture of ${person.name}`} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="md:col-span-2 p-4">
                                        <h4 className="text-base">{person.name}</h4>
                                        <p className="text-xs text-blue-600 mb-1">{person.title}</p>
                                        <p className="text-gray-600 text-xs">{person.intro}</p>
                                    </div>
                                </div>
                             </Card>
                         ))}
                     </div>
                </section>

                <section className="text-center border-t border-gray-200 pt-8">
                    <h3 className="text-lg mb-2">Interested or have questions?</h3>
                    <p className="text-gray-600 mb-4 text-sm">Contact us to order products or for direct engineering consultation.</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button onClick={() => window.open('https://www.messenger.com/login.php?next=https%3A%2F%2Fwww.messenger.com%2Ft%2F134017006733934%2F%3Fmessaging_source%3Dsource%253Apages%253Amessage_shortlink%26source_id%3D1441792%26recurring_notification%3D0', '_blank')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                            <Facebook className="mr-2 h-4 w-4" /> Facebook
                        </Button>
                         <Button onClick={() => window.open('https://line.me/ti/p/~nopparat_ka', '_blank')} className="bg-green-500 hover:bg-green-600 text-white text-xs">
                            <FileText className="mr-2 h-4 w-4" /> Line
                        </Button>
                        <Button variant="outline" onClick={() => window.open('https://sites.google.com/view/energy4you/home#h.hsv3v5o3wtd3', '_blank')} className="text-xs">
                            <Globe className="mr-2 h-4 w-4" /> Main Website
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; className?: string; };
const MockButton: FC<ButtonProps> = ({ children, ...props }) => <button {...props}>{children}</button>;

type DivProps = HTMLAttributes<HTMLDivElement>;
const MockCard: FC<DivProps> = ({ children, ...props }) => <div {...props}>{children}</div>;
const MockCardHeader: FC<DivProps> = ({ children, ...props }) => <div {...props}>{children}</div>;
const MockCardTitle: FC<DivProps> = ({ children, ...props }) => <h3 {...props}>{children}</h3>;
const MockCardContent: FC<DivProps> = ({ children, ...props }) => <div {...props}>{children}</div>;

export default DocumentPage;

