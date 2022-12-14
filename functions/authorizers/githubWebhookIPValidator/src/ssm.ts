import { SSMClient, GetParametersByPathCommand } from "@aws-sdk/client-ssm";

export const ssm = async (): Promise<void> => {
  const region = process.env.REGION ? process.env.REGION : "us-east-1";
  const ssmPath = process.env.SSM_PARAMETER_STORE_PREFIX
    ? process.env.SSM_PARAMETER_STORE_PREFIX
    : "boilerplate";
  const client = new SSMClient({ region });
  const command = new GetParametersByPathCommand({
    Path: `/${ssmPath}`,
    WithDecryption: true,
  });

  try {
    const { Parameters } = await client.send(command);

    if (Parameters) {
      Parameters.forEach((param) => {
        const name = param.Name ? param.Name.replace(`/${ssmPath}/`, "") : "";
        const value = param.Value ? param.Value : "";
        process.env[name] = value;
      });
    }
  } catch (err) {
    console.error("Error within function (ssm)", err);
    throw err;
  }
};
