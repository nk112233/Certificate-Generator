import React, { useState, useCallback, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import certificateTemplate from './assets/certificate.jpg';
import html2canvas from 'html2canvas';
import "./index.css";

const Certificate = () => {
  const certificateRef = useRef(null);
  const [name, setName] = useState('');
  const [course, setCourse] = useState('Sou. Venutai Chavan Polytechnic');
  const [selectedOption, setSelectedOption] = useState('option1');
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const [csvFile, setCsvFile] = useState(null);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [selectedNameColumn, setSelectedNameColumn] = useState('');
  const [selectedCourseColumn, setSelectedCourseColumn] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewName, setPreviewName] = useState('Your Name');
  const [fileName, setFileName] = useState("No file chosen");

  // Load the image and get its dimensions
  useEffect(() => {
    const img = new Image();
    img.src = certificateTemplate;
    img.onload = () => {
      setImgDimensions({
        width: img.width,
        height: img.height,
      });
    };
  }, []);

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCsvFileChange = async (event) => {
    const file = event.target.files[0];
    setFileName(file ? file.name : "No file chosen");
    if (!file) return;

    setCsvFile(file);

    // Read CSV headers
    try {
      const text = await file.text();
      const lines = text.split('\n');
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(header => header.trim()).filter(Boolean);
        setCsvHeaders(headers);

        // Auto-select name column if there's one called "name"
        const nameIndex = headers.findIndex(h => h.toLowerCase() === 'name');
        if (nameIndex !== -1) {
          setSelectedNameColumn(headers[nameIndex]);
        } else if (headers.length > 0) {
          setSelectedNameColumn(headers[0]);
        }

        // Auto-select course column if there's one called "course"
        const courseIndex = headers.findIndex(h => h.toLowerCase() === 'course');
        if (courseIndex !== -1) {
          setSelectedCourseColumn(headers[courseIndex]);
        }
      }
    } catch (error) {
      console.error('Error reading CSV headers:', error);
      alert('Error reading CSV file: ' + error.message);
    }
  };

  // Generate certificate by capturing the HTML element as an image
  const generateCertificateFromHTML = async (personName, personCourse) => {
    // Update the preview with the person's details
    setPreviewName(personName);

    // Wait for the DOM to update
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture the certificate preview as an image
    const canvas = await html2canvas(certificateRef.current, {
      scale: 3, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      logging: false,
    });

    // Create a new PDF with the same dimensions as the canvas
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    // Add the captured image to the PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

    // Reset the preview name
    setPreviewName('Your Name');

    return pdf;
  };

  const onButtonClick = useCallback(async () => {
    try {
      const doc = await generateCertificateFromHTML(name, course);
      doc.save(`${name}-certificate.pdf`);
    } catch (error) {
      console.error('Error generating single certificate:', error);
      alert('Error generating certificate: ' + error.message);
    }
  }, [name, course, selectedOption]);

  const parseCsv = (text, nameColumn, courseColumn) => {
    // Simple CSV parser
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const nameIndex = headers.indexOf(nameColumn);

    if (nameIndex === -1) {
      throw new Error(`Column "${nameColumn}" not found in CSV`);
    }

    const courseIndex = courseColumn ? headers.indexOf(courseColumn) : -1;

    const results = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const values = lines[i].split(',').map(value => value.trim());
      if (nameIndex >= values.length) continue;

      const personName = values[nameIndex];
      const personCourse = courseIndex !== -1 && courseIndex < values.length
        ? values[courseIndex]
        : course;

      if (personName) {
        results.push({
          name: personName,
          course: personCourse
        });
      }
    }

    return results;
  };

  const generateBulkCertificates = async () => {
    if (!csvFile) {
      alert('Please select a CSV file first');
      return;
    }

    if (!selectedNameColumn) {
      alert('Please select a column for names');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Read the CSV file
      const text = await csvFile.text();
      const data = parseCsv(text, selectedNameColumn, selectedCourseColumn);

      if (data.length === 0) {
        alert('No valid data found in the CSV file');
        setIsGenerating(false);
        return;
      }

      // Create a zip file
      const zip = new JSZip();

      // Generate certificates for each person
      for (let i = 0; i < data.length; i++) {
        const person = data[i];

        // Generate the certificate PDF using the HTML-to-image approach
        const doc = await generateCertificateFromHTML(person.name, person.course);
        const pdfBlob = doc.output('blob');

        // Add the PDF to the zip file
        zip.file(`${person.name}-certificate.pdf`, pdfBlob);

        // Update progress
        setProgress(Math.round(((i + 1) / data.length) * 100));
      }

      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });

      // Download the zip file
      saveAs(zipBlob, 'certificates.zip');
    } catch (error) {
      console.error('Error generating certificates:', error);
      alert('Error generating certificates: ' + error.message);
    } finally {
      setIsGenerating(false);
      // Reset the preview name when done
      setPreviewName('Your Name');
    }
  };

  // Determine the class to apply based on selected radio button
  const divClass = selectedOption === 'option1' ? 'option1Style' :
    selectedOption === 'option2' ? 'option2Style' :
      selectedOption === 'option3' ? 'option3Style' :
        selectedOption === 'option4' ? 'option4Style' : 'option5Style';

  return (
    <div className="p-4 mb-18">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Form controls */}
        <div>
          <h3 className="text-lg font-semibold">Certificate Generator</h3>

          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name for Single Certificate:
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Options</h3>
              <div className="grid grid-cols-2 gap-2">
                {['option1', 'option2', 'option3', 'option4', 'option5'].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="option"
                      value={option}
                      checked={selectedOption === option}
                      onChange={handleRadioChange}
                    />
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={onButtonClick}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mb-6 "
            >
              Generate Single Certificate
            </button>
          </div>

          <h3 className="text-lg font-semibold mb-2">Bulk Certificate Generation</h3>
          <div className="mb-4 flex justify-center flex-col">
            <div className='my-10'>
              <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                Choose File
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvFileChange}
                  className="hidden w-[100%]"
                />
              </label>
              <span id="fileName" className="ml-2 text-gray-600 w-[100%]">{fileName}</span>
            </div>

            {csvHeaders.length > 0 && (
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name Column (required):
                  </label>
                  <select
                    value={selectedNameColumn}
                    onChange={(e) => setSelectedNameColumn(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Name Column</option>
                    {csvHeaders.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College Name:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Options</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['option1', 'option2', 'option3', 'option4', 'option5'].map((option) => (
                      <label key={option} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="option"
                          value={option}
                          checked={selectedOption === option}
                          onChange={handleRadioChange}
                        />
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={generateBulkCertificates}
              disabled={isGenerating || !csvFile || !selectedNameColumn}
              className=" text-sm bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
            >
              {isGenerating ? 'Generating...' : 'Generate Bulk Certificates'}
            </button>
          </div>

          {isGenerating && (
            <div className="mb-4">
              <p>Generating certificates: {progress}%</p>
              <div className="w-full bg-gray-200 h-4 rounded-full">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Right column - Preview */}
        <div className='flex justify-center'>
          {/* <h3 className="text-lg font-semibold">Certificate Preview</h3> */}
          <div className="container" ref={certificateRef}>
            <img src={certificateTemplate} alt="certificate template" height={400} />
            <div className="content">
              <h1 className='font-bold'>{name || previewName}</h1>
              <h2>{course}</h2>
              <div className={`line-container ${divClass}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;