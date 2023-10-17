import {
    render, screen
} from '@testing-library/vue';
import '@testing-library/jest-dom';
import BoxZoneFeedback from '@/components/Feedback/BoxZoneFeedback';

test('should render BoxZoneFeedback', () => {
    render(BoxZoneFeedback, {
        props: {
            numFolders: 0,
            folders: [
                {
                    nameId: 'Comandos',
                    folderItems: []
                }
            ]
        }
    });
    expect(screen.getByText('Comandos')).toBeInTheDocument();
});
