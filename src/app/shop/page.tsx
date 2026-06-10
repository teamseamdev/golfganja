export default function ShopPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase text-gold">Shop</p>
        <h1 className="mt-2 text-3xl font-semibold">Golf N Ganja merch</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          The merch storefront shell will start here, with featured products and
          external checkout links once the store is ready.
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {["Apparel", "Headwear", "Accessories"].map((category) => (
            <div
              key={category}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <h2 className="text-xl font-semibold">{category}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Product drops and external checkout links coming soon.
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
