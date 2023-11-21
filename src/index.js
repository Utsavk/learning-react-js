import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { data } from "./data";

const outOfStockStylingClass = "outOfStock";

function Item(props) {
  return (
    <tr>
      <td className={props.inStock === false ? outOfStockStylingClass : ""}>
        {props.name}
      </td>
      <td>{props.price}</td>
    </tr>
  );
}

function CategoryWiseItems(props) {
  let rows = [];
  rows.push(
    <tr className="categoryNameRow">
      <td>{props.categoryName}</td>
    </tr>
  );

  let i = 0;
  for (const item of props.items) {
    rows.push(
      <Item
        name={item.name}
        price={item.price}
        inStock={item.inStock}
        key={i}
      />
    );
    i++;
  }

  return rows;
}

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: "",
      categoryWiseItems: [],
      onlyShowInStock: false,
    };
    this.handleSearchInput = this.handleSearchInput.bind(this);
    this.handleInStockInput = this.handleInStockInput.bind(this);
  }

  componentDidMount() {
    this.updateCategoryWiseItems(this.state);
  }

  handleSearchInput(event) {
    this.setState({ searchKey: event.target.value });
    this.updateCategoryWiseItems({
      ...this.state,
      searchKey: event.target.value,
    });
  }

  handleInStockInput(event) {
    this.setState({ onlyShowInStock: event.target.checked });
    this.updateCategoryWiseItems({
      ...this.state,
      onlyShowInStock: event.target.checked,
    });
  }

  updateCategoryWiseItems(state) {
    const categoryWiseItems = {};
    for (const element of data) {
      if (state.searchKey === "" || element.name.includes(state.searchKey)) {
        if (element.stocked === false && state.onlyShowInStock === true) {
          continue;
        }
        if (categoryWiseItems[element.category] === undefined) {
          categoryWiseItems[element.category] = [
            {
              name: element.name,
              price: element.price,
              inStock: element.stocked,
            },
          ];
        } else {
          categoryWiseItems[element.category].push({
            name: element.name,
            price: element.price,
            inStock: element.stocked,
          });
        }
      }
    }
    this.setState({ categoryWiseItems: categoryWiseItems });
  }

  renderCategoryWiseItems() {
    let rows = [];
    for (const [categoryName, items] of Object.entries(
      this.state.categoryWiseItems
    )) {
      rows.push(
        <CategoryWiseItems
          categoryName={categoryName}
          items={items}
          key={categoryName}
        />
      );
    }
    return rows;
  }

  render() {
    return (
      <div>
        <div>
          <input
            name="searchKey"
            type="text"
            value={this.state.searchKey}
            onChange={this.handleSearchInput}
            placeholder="Search..."
          />
          <div>
            <input
              name="onlyShowInStock"
              type="checkbox"
              checked={this.state.onlyShowInStock}
              onChange={this.handleInStockInput}
            />
            <label>Only show products in stock</label>
          </div>
        </div>
        <div>
          <table>
            <tbody>
              <tr className="heading">
                <td>Name</td>
                <td>Price</td>
              </tr>
              {this.renderCategoryWiseItems()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<SearchPage />);
