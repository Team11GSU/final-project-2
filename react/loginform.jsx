import {
  Box, Card, CardHeader, Heading, CardBody, Text,
} from 'grommet';

export default function Login() {
  return (
    <Box fill="vertical" overflow="auto" align="center" flex="grow" justify="center">
      <Card pad="large">
        <CardHeader align="center" direction="row" flex={false} justify="center" gap="medium" pad="small">
          <Heading>
            Dynamico
          </Heading>
        </CardHeader>
        <CardBody pad="small" align="center" justify="center">
          <Text>
            <p>
              Click
              {' '}
              <a href="/google">here</a>
              {' '}
              to login with a Google Account.
            </p>
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
}
