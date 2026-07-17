import { InvoiceClient } from './InvoiceClient';

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  return <InvoiceClient id={resolvedParams.id} />;
}
