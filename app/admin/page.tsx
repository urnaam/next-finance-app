'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { GlobalWorkerOptions } from 'pdfjs-dist';
// import { recognize } from 'tesseract.js';
// import { TextItem } from 'pdfjs-dist/types/src/display/api';

if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';
}

type Transaction = {
  debit: string;
  credit: string;
  date: string;
  beleg: string;
  description: string;
};

const AdminDashboard = () => {
  const [currentTab, setCurrentTab] = useState('visa'); // Default tab is 'visa'
  const [file, setFile] = useState<File | null>(null);
  const [amount] = useState<number | ''>('');
  const [ocrResult, setOcrResult] = useState<string>('');
  const [processingFile] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [table, setTable] = useState<string[][] | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('auth_token='))
      ?.split('=')[1];
    console.log('Cookies:', document.cookie);
    console.log('Token:', token);
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // const handleOcr = async (canvas: HTMLCanvasElement | HTMLImageElement) => {
  //   try {
  //     setProcessingFile(true);

  //     const {
  //       data: { text },
  //     } = await recognize(canvas, 'deu', {
  //       logger: (m) => console.log(m),
  //     });

  //     console.log('OCR Result:', text);
  //     setOcrResult(text);

  //     // Хүснэгтийн өгөгдлийг задлах шинэчилсэн функц
  //     const parsed = parseTableFromText(text);
  //     setTransactions(parsed);
  //   } catch (error) {
  //     console.error('OCR processing failed:', error);
  //   } finally {
  //     setProcessingFile(false);
  //   }
  // };

  // Текстээс хүснэгтийг илүү үр дүнтэй задлах функц
  // const parseTableFromText = (text: string): Transaction[] => {
  //   const datePattern = /\d{2}\.\d{2}\.\d{4}/;
  //   const amountPattern = /[-]?\d[\d.,]+/;
  //   const lines = text.split('\n').filter(Boolean);

  //   const transactions: Transaction[] = [];
  //   for (let i = 0; i < lines.length; i++) {
  //     const dateMatch = lines[i].match(datePattern);
  //     if (!dateMatch) continue;
  //     const date = dateMatch[0];
  //     let description = lines[i].replace(date, '').trim();
  //     let debit = '';
  //     let credit = '';
  //     let beleg = '';

  //     let j = i + 1;
  //     while (j < lines.length && !lines[j].match(datePattern)) {
  //       const line = lines[j];
  //       const amountMatch = line.match(amountPattern);
  //       if (amountMatch) {
  //         if (line.includes('-')) {
  //           debit = amountMatch[0];
  //         } else {
  //           credit = amountMatch[0];
  //         }
  //         break;
  //       } else {
  //         description += ' ' + line;
  //       }
  //       j++;
  //     }

  //     transactions.push({ date, description, beleg, debit, credit });
  //     i = j;
  //   }

  //   return transactions;
  // };

  // const extractTableFromPdf = async (file: File) => {
  //   try {
  //     setProcessingFile(true);
  //     const arrayBuffer = await file.arrayBuffer();
  //     const pdf = await getDocument({ data: arrayBuffer }).promise;

  //     // Бүх хуудсыг боловсруулах
  //     const numPages = pdf.numPages;
  //     let allText = '';

  //     for (let pageNum = 1; pageNum <= numPages; pageNum++) {
  //       const page = await pdf.getPage(1);

  //       // 1. Текст агуулгыг задлах
  //       const textContent = await page.getTextContent();
  //       const pageText = textContent.items
  //         .filter((item): item is TextItem => 'str' in item) // Type guard to narrow to TextItem
  //         .map((item) => item.str)
  //         .join(' ');

  //       allText += pageText + '\n';

  //       // 2. OCR хийх (зарим хүснэгт зураг хэлбэрээр байж болно)
  //       const viewport = page.getViewport({ scale: 2 });
  //       const canvas = document.createElement('canvas');
  //       const context = canvas.getContext('2d')!;
  //       canvas.width = viewport.width;
  //       canvas.height = viewport.height;

  //       await page.render({ canvasContext: context, viewport }).promise;

  //       // OCR хийх - хуудас бүрт биш, зөвхөн зургийг таньж чадаагүй тохиолдолд
  //       if (pageText.trim().length < 100) {
  //         // If extracted text is too short, apply OCR
  //         await handleOcr(canvas);
  //       } else {
  //         console.log('Using extracted text from PDF for page', pageNum);
  //       }
  //     }

  //     // Хэрэв allText нь хангалттай их текст агуулж байвал OCR хийх шаардлагагүй
  //     if (allText.trim().length > 100) {
  //       console.log('Using combined extracted text from PDF');
  //       setOcrResult(allText);
  //       const parsed = parseTableFromText(allText);
  //       setTransactions(parsed);
  //     }
  //   } catch (error) {
  //     console.error('PDF processing failed:', error);
  //   } finally {
  //     setProcessingFile(false);
  //   }
  // };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/ocr', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setTable(data.table);
    console.log('Table data:', data.table);
    // const transactions = parseTableFromText(data.text);
    // setTransactions(transactions);

    // if (file.type === 'application/pdf') {
    //   await extractTableFromPdf(file);
    // } else if (file.type.startsWith('image/')) {
    //   await handleImage(file);
    // } else {
    //   alert('Зөвхөн PDF файл эсвэл зураг оруулна уу.');
    // }
  };

  // const handleImage = async (file: File) => {
  //   try {
  //     setProcessingFile(true);
  //     const img = new Image();
  //     img.src = URL.createObjectURL(file);

  //     img.onload = async () => {
  //       await handleOcr(img);
  //     };
  //   } catch (error) {
  //     console.error('Image processing failed:', error);
  //     setProcessingFile(false);
  //   }
  // };
  // const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setAmount(value === '' ? '' : parseFloat(value));
  // };

  const handleLogout = () => {
    document.cookie =
      'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  const handleClear = () => {
    setFile(null);
    setOcrResult('');
    setTransactions([]);
    if (fileInputRef.current?.value) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="overflow-auto mt-4 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg p-4 border border-white/20">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="flex space-x-4 mt-6">
        <button
          onClick={() => setCurrentTab('visa')}
          className={`${
            currentTab === 'visa'
              ? 'bg-white/20 backdrop-blur-md border border-white/30 shadow-lg text-white'
              : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-200'
          } p-2 px-4 rounded-xl transition duration-300`}
        >
          Visa Гүйлгээ
        </button>
        <button
          onClick={() => setCurrentTab('simple')}
          className={`${
            currentTab === 'simple'
              ? 'bg-white/20 backdrop-blur-md border border-white/30 shadow-lg text-white'
              : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-200'
          } p-2 px-4 rounded-xl transition duration-300`}
        >
          Энгийн Гүйлгээ
        </button>
        <button
          onClick={() => setCurrentTab('cash')}
          className={`${
            currentTab === 'cash'
              ? 'bg-white/20 backdrop-blur-md border border-white/30 shadow-lg text-white'
              : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-200'
          } p-2 px-4 rounded-xl transition duration-300`}
        >
          Бэлэн Мөнгөний Гүйлгээ
        </button>
      </div>

      {/* PDF File Upload for Visa and Simple Transactions */}
      {currentTab === 'visa' || currentTab === 'simple' ? (
        <div className="mt-4">
          <div className="mb-4">
            <label className="block mb-2">PDF файл эсвэл зураг оруулах:</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="block mb-2 p-2 border border-gray-300 rounded"
            />
            {file && <p>Файл: {file.name}</p>}

            <div className="flex space-x-4 mt-2">
              <button
                onClick={handleClear}
                className="p-2 bg-red-500 text-white rounded-md"
                disabled={processingFile}
              >
                Арилгах
              </button>
            </div>

            {processingFile && (
              <div className="mt-2 text-blue-600">
                Файл боловсруулж байна... Түр хүлээнэ үү.
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold mb-2">Гүйлгээний хүснэгт</h2>
          <div className="overflow-x-auto">
            {table && (
              <table border={1} className="min-w-full text-sm text-white">
                <thead>
                  <tr>
                    {['Einnahmen', 'Ausgaben', 'Belegdatum Beleg-Nr.'].map(
                      (header, idx) => (
                        <th key={idx}>{header}</th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {table.map((row, idx) => (
                    <tr key={idx}>
                      {row.map((cell, i) => (
                        <td key={i}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <table className="min-w-full text-sm text-white">
              <thead className="bg-gray-100 text-black">
                <tr>
                  <th className="border px-4 py-2">Огноо</th>
                  <th className="border px-4 py-2">Гүйлгээний тайлбар</th>
                  <th className="border px-4 py-2">Бэлэн мөнгөний зарлага</th>
                  <th className="border px-4 py-2">Зарлага (EUR)</th>
                  <th className="border px-4 py-2">Орлого (EUR)</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((txn, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-gray-50' : ''}
                    >
                      <td
                        className={`border px-4 py-2 ${
                          index % 2 === 0 ? 'text-black' : 'text-white'
                        }`}
                      >
                        {txn.date}
                      </td>
                      <td
                        className={`border px-4 py-2 ${
                          index % 2 === 0 ? 'text-black' : 'text-white'
                        }`}
                      >
                        {txn.description}
                      </td>
                      <td
                        className={`border px-4 py-2 ${
                          index % 2 === 0 ? 'text-black' : 'text-white'
                        }`}
                      >
                        {txn.beleg}
                      </td>
                      <td
                        className={`border px-4 py-2 ${
                          index % 2 === 0 ? 'text-black' : 'text-white'
                        }`}
                      >
                        {txn.debit}
                      </td>
                      <td
                        className={`border px-4 py-2 ${
                          index % 2 === 0 ? 'text-black' : 'text-white'
                        }`}
                      >
                        {txn.credit}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="border px-4 py-2 text-center">
                      {processingFile
                        ? 'Гүйлгээний мэдээлэл боловсруулж байна...'
                        : 'Гүйлгээний мэдээлэл байхгүй байна. PDF файл оруулна уу.'}
                    </td>
                  </tr>
                )}
              </tbody>
              {transactions.length > 0 && (
                <tfoot className="bg-gray-100">
                  <tr>
                    <td
                      colSpan={2}
                      className="border px-4 py-2 text-right font-bold"
                    >
                      Нийт:
                    </td>
                    <td className="border px-4 py-2 text-red-600 font-bold">
                      {transactions
                        .reduce((sum, txn) => {
                          const value = txn.debit
                            .replace(/\./g, '')
                            .replace(',', '.');
                          return sum + (value ? parseFloat(value) : 0);
                        }, 0)
                        .toFixed(2)
                        .replace('.', ',')}
                    </td>
                    <td className="border px-4 py-2 text-green-600 font-bold">
                      {transactions
                        .reduce((sum, txn) => {
                          const value = txn.credit
                            .replace(/\./g, '')
                            .replace(',', '.');
                          return sum + (value ? parseFloat(value) : 0);
                        }, 0)
                        .toFixed(2)
                        .replace('.', ',')}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          {/* Cash Transaction */}
          <input
            type="number"
            value={amount === '' ? '' : Number(amount)}
            // onChange={handleAmountChange}
            placeholder="Мөнгөн дүн"
            className="block mb-4 p-2 border border-gray-300 rounded-md"
          />
          <button className="p-2 bg-green-500 text-white rounded-md">
            Гүйлгээ хийх
          </button>
        </div>
      )}

      {ocrResult && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">OCR Үр дүн</h2>
          <div className="p-4 bg-gray-100 rounded-md overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap text-sm">{ocrResult}</pre>
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-6 p-2 bg-red-500 text-white rounded-md"
      >
        Системээс гарах
      </button>
    </div>
  );
};

export default AdminDashboard;
