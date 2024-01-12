const fs = require('fs');

const nomeArquivoStrings = 'strings.txt'; // Arquivo strings.txt
const nomeArquivoTS = 'pcsx2-qt_en.ts'; // Arquivo .ts a ser atualizado com traduções

// Lê o conteúdo do arquivo 'strings.txt'
fs.readFile(nomeArquivoStrings, 'utf8', (err, data) => {
    if (err) {
        console.error('Ocorreu um erro ao ler o arquivo strings.txt:', err);
        return;
    }

    // Expressão regular para identificar o padrão de <translation>
    const regex = /<translation type="(.*?)">(.*?)<\/translation>/g;

    // Mapeia as correspondências de <translation> no conteúdo do arquivo strings.txt
    const translationsMap = new Map();
    let match;
    while ((match = regex.exec(data)) !== null) {
        translationsMap.set(match[1], match[2]);
    }

    // Lê o conteúdo do arquivo .ts
    fs.readFile(nomeArquivoTS, 'utf8', (err, tsData) => {
        if (err) {
            console.error('Ocorreu um erro ao ler o arquivo .ts:', err);
            return;
        }

        // Atualiza as traduções no arquivo .ts com as traduções do arquivo strings.txt
        translationsMap.forEach((translation, type) => {
            const regexToReplace = new RegExp(`<translation type="${type}">unfinished<\/translation>`, 'g');
            tsData = tsData.replace(regexToReplace, `<translation type="${type}">${translation}</translation>`);
        });

        // Escreve as alterações de volta no arquivo .ts
        fs.writeFile(nomeArquivoTS, tsData, (err) => {
            if (err) {
                console.error('Ocorreu um erro ao escrever no arquivo .ts:', err);
                return;
            }
            console.log(`As traduções foram atualizadas em ${nomeArquivoTS} com sucesso.`);
        });
    });
});
