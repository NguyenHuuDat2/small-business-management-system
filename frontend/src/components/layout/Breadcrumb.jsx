function Breadcrumb({ items }) {

  return (
    <div className="text-sm text-gray-500 mb-3">

      {items.map((item, index) => (

        <span key={index}>

          {item}

          {index < items.length - 1 && " / "}

        </span>

      ))}

    </div>
  );
}

export default Breadcrumb;