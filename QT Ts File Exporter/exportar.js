const fs = require('fs');

const nomeArquivoXML = 'pcsx2-qt_en.ts';

// Função de leitura do XML
fs.readFile(nomeArquivoXML, 'utf8', (err, data) => {
    if (err) {
        console.error('Ocorreu um erro ao ler o arquivo:', err);
        return;
    }

    // Regex para encotrar as etiquetas <message> ... </message>
    const regex = /<message>[\s\S]*?<\/message>/g;

    // Encontrar ocorrências no conteúdo do arquivo
    const matches = data.match(regex);

    // Verificar combinações
    if (matches && matches.length > 0) {
        const stringsToExport = matches.join('\n'); 

        const nomeArquivoSaida = 'strings.txt';

        // Escreve no arquivo
        fs.writeFile(nomeArquivoSaida, stringsToExport, (err) => {
            if (err) {
                console.error('Ocorreu um erro ao escrever no arquivo:', err);
                return;
            }
            console.log(`As strings foram exportadas para ${nomeArquivoSaida} com sucesso.`);
        });
    } else {
        console.log('Nenhuma correspondência encontrada.');
    }
});
