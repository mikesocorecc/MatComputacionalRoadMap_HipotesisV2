import { render, screen, fireEvent } from '@testing-library/vue';
import '@testing-library/jest-dom';
import StatementPanel from '../../src/components/StatementPanel';

test('should switch to the exercise screen', async () => {
    const { emitted } = render(
        StatementPanel,
        {
            props: {
                initialPanel: true,
                dataStatement: {
                    title: 'Situate en la casilla @ y pulsa el botón de acción en cada una de ellas',
                    urlImageTitle: 'statement-img',
                    urlImageItem: ['scene-C'],
                    showOrder: false,
                    questions: []
                }
            }
        }
    );

    const button = screen.getByText('Continuar');
    expect(button).toBeInTheDocument();
    await fireEvent.click(button);
    expect(emitted().showStatementInfo).toBeTruthy();
    expect(emitted().showStatementInfo[0][0].action).toEqual('Continuar');
});

test('should render closedBtn and not continue button', async () => {
    const { emitted } = render(
        StatementPanel,
        {
            props: {
                initialPanel: false,
                dataStatement: {
                    title: 'Situate en la casilla @ y pulsa el botón de acción en cada una de ellas',
                    urlImageTitle: 'statement-img',
                    urlImageItem: ['scene-C'],
                    showOrder: false,
                    questions: []
                }
            }
        }
    );
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    await fireEvent.click(button);
    expect(emitted().showStatementInfo).toBeTruthy();
    const continueBtn = screen.queryByText('Continuar');
    expect(continueBtn).not.toBeInTheDocument();
});
