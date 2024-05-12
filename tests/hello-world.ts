import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HelloWorld } from "../target/types/hello_world";

describe("hello-world", () => {
  // Configure the client to use the local cluster.
  let provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.HelloWorld as Program<HelloWorld>;
  const user = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    let airdrop_tx = await provider.connection.requestAirdrop(
      user.publicKey,
      1000000000
    );
    await provider.connection.confirmTransaction(airdrop_tx, "confirmed");

    // PDA
    const [user_data_pda, _] =
      await anchor.web3.PublicKey.findProgramAddressSync(
        [anchor.utils.bytes.utf8.encode("hello"), user.publicKey.toBuffer()],
        program.programId
      );

    const tx = await program.methods
      .initialize({
        name: "Ben",
        age: 10,
      })
      .accounts({
        data: user_data_pda,
        authority: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
