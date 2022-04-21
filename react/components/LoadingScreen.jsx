import {
  Box, Spinner,
} from 'grommet';

export default function LoadingScreen() {
  return (
    <Box fill="vertical" overflow="auto" align="center" flex="grow" justify="center">
      <Spinner />
    </Box>
  );
}
