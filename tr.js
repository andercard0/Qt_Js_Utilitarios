const fs = require('fs');
const { parseString, Builder } = require('xml2js');
const { Translate } = require('@google-cloud/translate').v2;

const API_KEY = 'Insira sua chave API do cloud translation google aqui';

const translate = new Translate({ key: API_KEY });

const sourceLanguage = 'Defina o idioma original aqui ex: en';
const targetLanguage = 'Defina o idioma alvo aqui ex: jp';

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

fs.readFile('ExemploDeArquivoOriginal_en.ts', 'utf8', async (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo:', err);
        return;
    }

    parseString(data, async (err, result) => {
        if (err) {
            console.error('Erro ao analisar o XML:', err);
            return;
        }

        for (const message of result.TS.context[0].message) {
            const sourceText = message.source[0];
            const translatedText = await translateText(sourceText);

            message.translation[0] = translatedText;
        }

        const builder = new Builder();
        const xml = builder.buildObject(result);

        fs.writeFile('tr_pcsx2-qt_en.ts', xml, err => {
            if (err) {
                console.error('Erro ao escrever o arquivo:', err);
                return;
            }
            console.log('Arquivo de tradução criado com sucesso!');
        });
    });
});
