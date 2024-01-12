const fs = require('fs');
const { parseString, Builder } = require('xml2js');
const { Translate } = require('@google-cloud/translate').v2;

// Insira sua chave de API do Google cloud translation aqui
const API_KEY = 'AIzaSyBoijTYcUs1uvQYIe3fw5oo47Lv6NRHMzw';
const translate = new Translate({ key: API_KEY });

// Origem e Destino
const sourceLanguage = 'en';
const targetLanguage = 'pt';

async function translateText(text) {
    try {
        const [translation] = await translate.translate(text, {
            from: sourceLanguage,
            to: targetLanguage,
        });
        return translation;
    } catch (error) {
        console.error('Erro na tradução:', error);
        return text;
    }
}

fs.readFile('pcsx2-qt_en.ts', 'utf8', async (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo:', err);
        return;
    }

    parseString(data, async (err, result) => {
        if (err) {
            console.error('Erro ao analisar o XML:', err);
            return;
        }

        // Automação do source para a linha translation
        for (const message of result.TS.context[0].message) {
            const sourceText = message.source[0];
            const translatedText = await translateText(sourceText);

            // Atualizando a tag <translation>
            message.translation[0] = translatedText;
        }

        const builder = new Builder();
        const xml = builder.buildObject(result);

        // Escrevendo o novo arquivo .ts com as traduções
        fs.writeFile('tr_pcsx2-qt_en.ts', xml, err => {
            if (err) {
                console.error('Erro ao escrever o arquivo:', err);
                return;
            }
            console.log('Arquivo de tradução criado com sucesso!');
        });
    });
});
