import { expect } from 'chai';
import { temporaryDir, shell, read } from '../helpers';
const tmp = temporaryDir();

describe('CLI simple flags', () => {
    const tmpFolder = tmp.name + '-tsconfig';
    const distFolder = tmpFolder + '/documentation';

    describe('when specific files are included in tsconfig', () => {
        let moduleFile = undefined;
        before(function (done) {
            tmp.create(tmpFolder);
            tmp.copy('./test/fixtures/sample-files/', tmpFolder);

            const ls = shell(
                'node',
                ['../bin/index-cli.js', '-p', './tsconfig.entry.json', '-d', 'documentation'],
                { cwd: tmpFolder }
            );

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            moduleFile = read(`${distFolder}/modules/AppModule.html`);
            done();
        });
        after(() => tmp.clean(distFolder));

        it('should only create links to files included via tsconfig', () => {
            expect(moduleFile).to.contain('components/FooComponent.html');
            expect(moduleFile).to.contain('modules/FooModule.html');
            expect(moduleFile).not.to.contain('components/BarComponent.html');
            expect(moduleFile).not.to.contain('injectables/FooService.html');
            expect(moduleFile).not.to.contain('modules/BarModule.html');
        });
    });

    describe('when specific files are included in tsconfig + others', () => {
        let moduleFile = undefined;
        before(function (done) {
            const ls = shell(
                'node',
                [
                    '../bin/index-cli.js',
                    '-p',
                    './tsconfig.entry-and-include.json',
                    '-d',
                    'documentation'
                ],
                { cwd: tmpFolder }
            );

            if (ls.stderr.toString() !== '') {
                console.error(`shell error: ${ls.stderr.toString()}`);
                done('error');
            }
            moduleFile = read(`${distFolder}/modules/AppModule.html`);
            done();
        });
        after(() => tmp.clean(distFolder));

        it('should only create links to files included via tsconfig', () => {
            expect(moduleFile).to.contain('components/FooComponent.html');
            expect(moduleFile).to.contain('modules/FooModule.html');
            expect(moduleFile).to.contain('components/BarComponent.html');
            expect(moduleFile).not.to.contain('injectables/FooService.html');
            expect(moduleFile).not.to.contain('modules/BarModule.html');
        });
    });
});
