use anchor_lang::prelude::*;

declare_id!("3upkzyV7kyGXTuvjY4LrMkBR8epDnRT6uErcdaLvZXrf");

const PDA_SEED: &[u8] = b"hello";

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UserInfoParams {
    pub name: String,
    pub age: u8,
}

#[program]
pub mod hello_world {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, data: UserInfo) -> Result<()> {
        let user_data = &mut ctx.accounts.data;
        user_data.name = data.name;
        user_data.age = data.age;
        Ok(())
    }
}

#[account]
pub struct UserInfo {
    pub name: String,
    pub age: u8,
}

#[derive(Accounts)]
#[instruction(instruction_data: UserInfo)]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [PDA_SEED, authority.key().as_ref()],
        bump,
        payer = authority,
        space =  8 + 4 + instruction_data.name.len() + 1,
    )]
    pub data: Account<'info, UserInfo>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
