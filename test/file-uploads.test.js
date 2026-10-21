const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { DataEntryFormPage } = require('../src/pages/data-entry-form-page');

describe('Upload de arquivos', function () {
  let temporaryDirectory;
  let textFile;
  let csvFile;

  before(async function () {
    temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'selenium-upload-'));
    textFile = path.join(temporaryDirectory, 'arquivo-teste.txt');
    csvFile = path.join(temporaryDirectory, 'dados-teste.csv');
    await fs.writeFile(textFile, 'conteudo de teste');
    await fs.writeFile(csvFile, 'nome,valor\nitem,1');
  });

  after(async function () {
    if (temporaryDirectory) {
      await fs.rm(temporaryDirectory, { recursive: true, force: true });
    }
  });

  it('valida e exibe os detalhes de um arquivo único', async function () {
    const page = new DataEntryFormPage(this.driver);

    await page.submitUpload('singleFileForm');
    assert.equal(await page.uploadStatus('singleFileStatus'), 'No file selected.');

    await page.selectUploadFiles('singleFileInput', [textFile]);
    await page.submitUpload('singleFileForm');

    const status = await page.uploadStatus('singleFileStatus');
    assert.match(status, /Single file selected: arquivo-teste\.txt, Size: 17 bytes/);
  });

  it('valida e exibe os detalhes de vários arquivos', async function () {
    const page = new DataEntryFormPage(this.driver);

    await page.submitUpload('multipleFilesForm');
    assert.equal(await page.uploadStatus('multipleFilesStatus'), 'No files selected.');

    await page.selectUploadFiles('multipleFilesInput', [textFile, csvFile]);
    await page.submitUpload('multipleFilesForm');

    const status = await page.uploadStatus('multipleFilesStatus');
    assert.match(status, /Multiple files selected:/);
    assert.match(status, /arquivo-teste\.txt, Size: 17 bytes/);
    assert.match(status, /dados-teste\.csv, Size: 17 bytes/);
  });
});