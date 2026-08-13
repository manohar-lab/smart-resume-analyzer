import logging
from typing import Tuple
import io

logger = logging.getLogger(__name__)

try:
    import PyPDF2
    PDF_AVAILABLE = True
except ImportError:
    PDF_AVAILABLE = False
    logger.warning("PyPDF2 not available, PDF support disabled")

def extract_text_from_pdf(file_content: bytes) -> str:
    """
    Extract text from PDF file
    
    Args:
        file_content: PDF file bytes
        
    Returns:
        Extracted text string
        
    Raises:
        ValueError: If PDF is invalid or extraction fails
    """
    if not PDF_AVAILABLE:
        raise ValueError("PDF processing not available. Install PyPDF2.")
    
    try:
        pdf_file = io.BytesIO(file_content)
        reader = PyPDF2.PdfReader(pdf_file)
        
        text = ""
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text() + "\n"
        
        if not text.strip():
            raise ValueError("No text could be extracted from PDF")
            
        logger.info(f"Successfully extracted {len(text)} characters from PDF")
        return text
        
    except Exception as e:
        logger.error(f"Error extracting PDF: {str(e)}")
        raise ValueError(f"Failed to extract text from PDF: {str(e)}")

def extract_text_from_txt(file_content: bytes) -> str:
    """
    Extract text from TXT file
    
    Args:
        file_content: TXT file bytes
        
    Returns:
        Extracted text string
        
    Raises:
        ValueError: If decoding fails
    """
    try:
        text = file_content.decode('utf-8')
        logger.info(f"Successfully extracted {len(text)} characters from TXT")
        return text
    except UnicodeDecodeError:
        try:
            text = file_content.decode('latin-1')
            logger.info(f"Successfully extracted {len(text)} characters from TXT (latin-1)")
            return text
        except Exception as e:
            logger.error(f"Error decoding TXT: {str(e)}")
            raise ValueError(f"Failed to decode text file: {str(e)}")

def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """
    Extract text from file based on extension
    
    Args:
        file_content: File bytes
        filename: Original filename with extension
        
    Returns:
        Extracted text string
        
    Raises:
        ValueError: If file type not supported or extraction fails
    """
    filename_lower = filename.lower()
    
    if filename_lower.endswith('.pdf'):
        return extract_text_from_pdf(file_content)
    elif filename_lower.endswith('.txt'):
        return extract_text_from_txt(file_content)
    else:
        raise ValueError(f"Unsupported file type: {filename}. Supported: .pdf, .txt")

def clean_text(text: str) -> str:
    """
    Clean extracted text - remove extra whitespace, normalize
    
    Args:
        text: Raw text to clean
        
    Returns:
        Cleaned text
    """
    # Remove extra whitespace
    lines = text.split('\n')
    lines = [line.strip() for line in lines if line.strip()]
    text = '\n'.join(lines)
    
    # Remove multiple consecutive newlines
    while '\n\n\n' in text:
        text = text.replace('\n\n\n', '\n\n')
    
    return text
