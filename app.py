import os
import PyPDF2
import re
from flask import Flask, request, render_template, jsonify


app = Flask(__name__)

def extract_text_from_pdf(pdf_file):
    """Takes a PDF file as input and returns the text content as a string"""
    with open(pdf_file, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

def extract_texts_from_all_pdfs(directory):
    """Takes a directory as input and returns the text content as a string"""
    all_text = ""
    for filename in os.listdir(directory):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(directory, filename)
            all_text += extract_text_from_pdf(pdf_path)
    return all_text

def search_question_in_pdf(question, pdf_text, search_mode):
    # Encuentra el índice de la pregunta en el texto
    index = pdf_text.lower().find(question.lower())
    
    if index != -1:
        # Inicia la búsqueda desde el final de la pregunta
        start_index = index + len(question)

        if search_mode == "fecha":
            # Busca la fecha en el formato dd/mm/yy
            match = re.search(r"\d{1,2}/\d{1,2}/\d{2}(?:\s+\d{1,2}:\d{2})?", pdf_text[start_index:])
            
            if match:
                # La posición donde se encuentra la fecha
                end_index = start_index + match.end()
                return pdf_text[index:end_index]
            else:
                # Si no se encuentra la fecha, devuelve 800 caracteres por defecto
                return pdf_text[index:index + 800]

        elif search_mode == "800":
            # Devuelve 800 caracteres desde la pregunta
            return pdf_text[index:index + 800]
    
    return "Pregunta no encontrada."

# Cargar el texto de todos los PDFs en el directorio 'pdfs'
pdf_directory = "pdfs"
pdf_text = extract_texts_from_all_pdfs(pdf_directory)

@app.route('/')
def index():
    # Obtener el parámetro 'question' de la URL
    """
    La página principal de la aplicación.

    Se encarga de obtener el parámetro 'question' de la URL y pasarlo a la
    plantilla 'index.html' para que se llene el campo de búsqueda con
    el valor de la pregunta.
    """
    question = request.args.get('question', '')
    return render_template('index.html', question=question)

@app.route('/search', methods=['POST'])
def search():
    data = request.json
    question = data.get("question")
    search_mode = data.get("searchMode", "800")  # Por defecto busca 600 caracteres

    if not question:
        return jsonify({"error": "No se envió ninguna pregunta"}), 400
    
    result = search_question_in_pdf(question, pdf_text, search_mode)
    return jsonify({"result": result})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
