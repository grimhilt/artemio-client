import { Card, Text, Image, Button, Group, Center } from '@mantine/core';
import MediaPlayer from '../../components/media-player';

const FileView = ({ file, onSelect, onDelete, ...props }) => {
    // const deleteHandler = async () => {
    //     try {
    //         await API.deleteFile(file.id);
    //         onDelete(file.id);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    return (
        <Card shadow="sm" padding="md" withBorder>
            <Card.Section>
                <Center>
                    <MediaPlayer file={file} shouldContain={true} />
                </Center>
            </Card.Section>
            <Text>{file?.name ?? 'File Name'}</Text>
            <Group position="center" grow>
                {!props.noSelect ? (
                    <Button color="green" mt="sm" variant="light" onClick={() => onSelect(file?.id)}>
                        Select
                    </Button>
                ) : (
                    <></>
                )}
                <Button color="red" mt="sm" variant="light">
                    Delete
                </Button>
            </Group>
        </Card>
    );
};

export default FileView;
