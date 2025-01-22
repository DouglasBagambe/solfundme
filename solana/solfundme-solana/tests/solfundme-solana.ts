import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolfundmeSolana } from "../target/types/solfundme_solana";

describe("solfundme-solana", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolfundmeSolana as Program<SolfundmeSolana>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
