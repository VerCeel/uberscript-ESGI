export class TropPauvreErreur extends Error {
  public remainingWallet: number;
  public orderTotal: number;

  constructor(message: string, remainingWallet: number, orderTotal: number) {
    super(message);
    this.name = "TropPauvreErreur";
    this.remainingWallet = remainingWallet;
    this.orderTotal = orderTotal;
  }
}
