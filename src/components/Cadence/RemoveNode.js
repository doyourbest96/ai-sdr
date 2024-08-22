import React from "react";
import { Handle, Position } from "@xyflow/react";
import { PhoneIcon, XCircleIcon } from "@heroicons/react/24/outline";
import Node from "./node";

//custome node
const RemoveNode = ({ data, selected }) => {
    return (
        <Node data={data} selected={selected} title="Remove from Cadence" description="Step information is incomplete" icon={<XCircleIcon className="w-4 h-4 stroke-gray-500" />}>
            <Handle
                id="a"
                type="target"
                position={Position.Top}
                className="w-1 rounded-full bg-slate-500"
            />
            <Handle
                id="b"
                type="source"
                position={Position.Bottom}
                className="w-1 rounded-full bg-gray-500"
            />
        </Node>
    );
}

export default RemoveNode;
