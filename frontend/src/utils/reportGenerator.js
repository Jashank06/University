import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates a PDF report from a specific DOM element.
 * @param {string} elementId - The ID of the DOM element to capture.
 * @param {string} title - The title of the report and the filename.
 */
export const generatePDFReport = async (elementId, title) => {
    const input = document.getElementById(elementId);

    if (!input) {
        console.error(`Element with id '${elementId}' not found`);
        return;
    }

    try {
        const canvas = await html2canvas(input, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc) => {
                // 1. Inject a "Universal High Contrast" stylesheet
                const style = clonedDoc.createElement('style');
                style.innerHTML = `
                    /* Force EVERY text and icon to be solid black */
                    * {
                        color: #000000 !important;
                        fill: #000000 !important;
                        -webkit-text-fill-color: #000000 !important;
                        opacity: 1 !important;
                        visibility: visible !important;
                        text-shadow: none !important;
                        box-shadow: none !important;
                        backdrop-filter: none !important;
                        animation: none !important;
                        transition: none !important;
                        background-image: none !important;
                    }

                    /* Forcibly kill ALL decorative layers (Pseudo-elements) */
                    *::before, *::after {
                        content: none !important;
                        display: none !important;
                        opacity: 0 !important;
                        visibility: hidden !important;
                        background: none !important;
                    }

                    /* Backgrounds: Force containers to white, rest to transparent */
                    .dashboard-container, .stat-card, .chart-container, .filter-container {
                        background: #ffffff !important;
                        background-color: #ffffff !important;
                        border: 2px solid #333333 !important;
                    }

                    /* Fix for the main titles */
                    .dashboard-title {
                        font-size: 32px !important;
                        font-weight: 800 !important;
                        margin-bottom: 10px !important;
                        display: block !important;
                    }

                    /* Fix for Stat Value (Numbers) */
                    .stat-value {
                        font-size: 36px !important;
                        font-weight: 900 !important;
                        display: block !important;
                    }

                    /* Hide interactive elements */
                    button, .download-btn, .reset-filters-btn {
                        display: none !important;
                    }

                    /* Ensure charts are crisp */
                    text, tspan, .recharts-text {
                        font-weight: 700 !important;
                        font-size: 14px !important;
                    }
                `;
                clonedDoc.head.appendChild(style);

                // 2. Direct DOM manipulation for extra safety
                clonedDoc.querySelectorAll('*').forEach(el => {
                    el.style.opacity = '1';
                    el.style.visibility = 'visible';
                });
            }
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const margin = 10;
        const imgWidth = pdfWidth - (2 * margin);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const startY = 40;
        let heightLeft = imgHeight;
        let position = startY;

        // Add Header on first page
        pdf.setFontSize(22);
        pdf.setTextColor(0, 0, 0);
        pdf.text(title, margin, 20);
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, 28);
        pdf.line(margin, 32, pdfWidth - margin, 32);

        // Add first page content
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - startY);

        // Add subsequent pages if content is long
        while (heightLeft > 0) {
            pdf.addPage();
            // Header for secondary pages
            pdf.setFontSize(10);
            pdf.setTextColor(150, 150, 150);
            pdf.text(`${title} - Continued`, margin, 10);

            position = heightLeft - imgHeight;
            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save(`${title.replace(/\s+/g, '_')}_Report.pdf`);
        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        return false;
    }
};
