const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('MYNFT', async () => {
  let MYNFT, MyToken, mynft, mytoken;
  let owner, user1, user2, user3;

  before(async () => {
    const accounts = await ethers.getSigners();
    owner = accounts[0];
    user1 = accounts[1];
    user2 = accounts[2];
    user3 = accounts[2];

    MyToken = await ethers.getContractFactory('MyToken');
    mytoken = await MyToken.deploy();
    await mytoken.deployed();

    await mytoken
      .connect(owner)
      .mint(user1.address, ethers.utils.parseEther('100000'));

    MYNFT = await ethers.getContractFactory('MYNFT');
    mynft = await MYNFT.deploy(mytoken.address);
    await mynft.deployed();
  });

  it('sanity checks', async () => {
    expect(await mytoken.balanceOf(user1.address)).to.eq(
      ethers.utils.parseEther('100000')
    );
  });

  it('should let user to purchase', async () => {
    const balance = await mytoken.balanceOf(user1.address);
    const price = await mynft.price();
    await mytoken.connect(user1).approve(mynft.address, price);
    await mynft.connect(user1).purchase();
    expect(await mynft.balanceOf(user1.address)).to.eq(1);
    expect(await mynft.ownerOf(0)).to.eq(user1.address);
    expect(await mynft.sold()).to.eq(true);
  });

  it('should let owner sell', async () => {
    await mynft.connect(owner).sell();
    expect(await mynft.sold()).to.eq(false);
  });

  it('should not let owner to sell', async () => {
    await expect(mynft.connect(owner).sell()).to.be.revertedWith(
      'NFT has been sold'
    );
  });
});
