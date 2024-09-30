import React from "react";
import { Handle, Position } from "@xyflow/react";
import { ArchiveBoxIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import Node from "./node";

//custome node
const LinkedinNode = ({ data, selected }) => {
    return (
        <Node data={data} selected={selected} title="Linkedin" description="Step information is incomplete" icon={<ArchiveBoxIcon className="w-4 h-4 stroke-gray-500" />}>
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

export default LinkedinNode;
