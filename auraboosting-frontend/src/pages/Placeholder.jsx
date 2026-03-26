function PlaceholderPage({ title }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-70">Sección en construcción</p>
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        <div className="badge badge-outline">Próximamente</div>
      </div>
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <p className="opacity-80 text-sm">
            En construccion

          </p>
        </div>
      </div>
    </div>
  )
}

export default PlaceholderPage
