FROM httpd:latest

# Copie todos os arquivos da pasta local para o diretório de conteúdo do Apache
COPY . /usr/local/apache2/htdocs/

# Exponha a porta padrão do Apache
EXPOSE 80