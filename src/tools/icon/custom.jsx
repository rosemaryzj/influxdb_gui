import Icon from "@ant-design/icons"

const TestOutlineSvg = () => (
  <svg
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>test icon</title>
    <path
      d="M3 4h18M3 12h18M3 20h18M6 4v16M18 4v16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);



const DeleteOutlineSvg = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <title>delete icon</title>
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6M3 6h18M9 11v6M15 11v6" />
  </svg>
);


const EditOutlineSvg = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <title>edit icon</title>
    <path d="M3 17.25v3.25h3.25L15.31 10.69l-3.25-3.25L3 17.25zM16.31 4.69a1 1 0 0 1 1.42 0l2.59 2.59a1 1 0 0 1 0 1.42l-1.42 1.42-3.25-3.25 1.42-1.42z" />
  </svg>
);


const EnterOutlineSvg = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  > 
    <title>enter icon</title>
    <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <path d="M12 8l4 4-4 4M16 12H8" />
  </svg>
);



const TestOutlined = (props) => <Icon component={TestOutlineSvg} {...props} />;
const DeleteOutlined1 = (props) => <Icon component={DeleteOutlineSvg} {...props} />;
const EditOutlined1 = (props) => <Icon component={EditOutlineSvg} {...props} />;
const EnterOutlined1 = (props) => <Icon component={EnterOutlineSvg} {...props} />;
export { TestOutlined, DeleteOutlined1, EditOutlined1, EnterOutlined1 };