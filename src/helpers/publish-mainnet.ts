import { Ipfs, type Op } from '@graphprotocol/grc-20';
import { getSmartAccountWalletClient } from '@graphprotocol/grc-20';
import { config } from './lib/core/config';

type PublishOptions = {
  spaceId: string;
  editName: string;
  author: string;
  ops: Op[];
};

export async function publish(options: PublishOptions) {

  const privateKey = `0x${config.pkMainnet}` as `0x${string}`;

  const smartAccountWalletClient = await getSmartAccountWalletClient({
    privateKey,
    //rpcUrl: config.rpc, // optional
  });

  const cid = await Ipfs.publishEdit({
    name: options.editName,
    author: options.author,
    ops: options.ops,
  });

  console.log('cid', cid);

  // This returns the correct contract address and calldata depending on the space id
  // Make sure you use the correct space id in the URL below and the correct network.
  const result = await fetch(
    `https://api-testnet.grc-20.thegraph.com/space/${options.spaceId}/edit/calldata`,
    {
      method: 'POST',
      body: JSON.stringify({
        cid: cid,
        network: 'MAINNET',
      }),
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { to, data } = await result.json();

  return await smartAccountWalletClient.sendTransaction({
    to: to,
    value: 0n,
    data: data,
  });
}
