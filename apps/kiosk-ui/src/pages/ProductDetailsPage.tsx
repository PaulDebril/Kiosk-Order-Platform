import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoAdd, IoRemove, IoCheckmarkCircle } from 'react-icons/io5';
import { productService } from '../services';
import { useCart } from '../context/CartContext';
import type { Product, ProductOption, ProductOptionGroup, SelectedOption } from '../types';

export const ProductDetailsPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({}); // groupId -> array of optionIds

    useEffect(() => {
        const loadProduct = async () => {
            if (productId) {
                setLoading(true);
                const data = await productService.getProductById(productId);
                setProduct(data || null);

                // Initialize default selections for required single options
                if (data?.optionGroups) {
                    const defaults: Record<string, string[]> = {};
                    data.optionGroups.forEach(group => {
                        if (group.type === 'single' && group.required && group.options.length > 0) {
                            defaults[group.id] = [group.options[0].id];
                        } else {
                            defaults[group.id] = [];
                        }
                    });
                    setSelectedOptions(defaults);
                }
                setLoading(false);
            }
        };
        loadProduct();
    }, [productId]);

    const toggleOption = (group: ProductOptionGroup, option: ProductOption) => {
        setSelectedOptions(prev => {
            const current = prev[group.id] || [];

            if (group.type === 'single') {
                // Radio behavior
                return { ...prev, [group.id]: [option.id] };
            } else {
                // Checkbox behavior
                if (current.includes(option.id)) {
                    return { ...prev, [group.id]: current.filter(id => id !== option.id) };
                } else {
                    // Check max quantity constraint
                    if (group.maxQuantity && current.length >= group.maxQuantity) {
                        return prev; // Do nothing if max reached
                    }
                    return { ...prev, [group.id]: [...current, option.id] };
                }
            }
        });
    };

    const totalPrice = useMemo(() => {
        if (!product) return 0;
        let total = product.price;

        if (product.optionGroups) {
            product.optionGroups.forEach(group => {
                const selectedIds = selectedOptions[group.id] || [];
                selectedIds.forEach(id => {
                    const option = group.options.find(o => o.id === id);
                    if (option) {
                        total += option.price;
                    }
                });
            });
        }

        return total * quantity;
    }, [product, selectedOptions, quantity]);

    const handleAddToCart = () => {
        if (!product) return;

        // Transform selections to CartItem format
        const finalOptions: SelectedOption[] = [];
        if (product.optionGroups) {
            product.optionGroups.forEach(group => {
                const selectedIds = selectedOptions[group.id] || [];
                selectedIds.forEach(id => {
                    const option = group.options.find(o => o.id === id);
                    if (option) {
                        finalOptions.push({
                            groupId: group.id,
                            optionId: option.id,
                            name: option.name,
                            price: option.price
                        });
                    }
                });
            });
        }

        addItem(product, quantity, finalOptions);
        navigate('/menu');
    };

    const isSelectionValid = useMemo(() => {
        if (!product || !product.optionGroups) return true;

        // Check if all required groups have a selection
        return product.optionGroups.every(group => {
            if (!group.required) return true;
            const selected = selectedOptions[group.id];
            return selected && selected.length > 0;
        });
    }, [product, selectedOptions]);


    if (loading) {
        return (
            <div className="h-screen bg-stone-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="h-screen bg-stone-950 flex flex-col items-center justify-center text-white">
                <p className="text-xl mb-4">Produit introuvable</p>
                <button onClick={() => navigate('/menu')} className="text-primary-500 underline">Retour au menu</button>
            </div>
        );
    }

    return (
        <div className="h-screen bg-stone-950 text-white flex flex-col lg:flex-row overflow-hidden relative">

            {/* Left: Image (Scrollable on mobile, Fixed on Desktop) */}
            <div className="lg:w-1/2 h-1/3 lg:h-full relative shrink-0">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-stone-950/80" />

                <button
                    onClick={() => navigate('/menu')}
                    className="absolute top-6 left-6 p-4 rounded-full bg-stone-900/50 backdrop-blur-md text-white hover:bg-white hover:text-stone-900 transition-all z-20"
                >
                    <IoArrowBack className="w-8 h-8" />
                </button>
            </div>

            {/* Right: Details & Customization (Scrollable) */}
            <div className="lg:w-1/2 h-2/3 lg:h-full flex flex-col bg-stone-950 relative z-10">
                <div className="flex-1 overflow-y-auto p-8 lg:p-12 pb-32 custom-scrollbar">

                    <div className="mb-8">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
                                {product.name}
                            </h1>
                            <div className="bg-stone-800 px-4 py-2 rounded-xl text-xl font-bold text-primary-500 whitespace-nowrap">
                                {product.price.toFixed(2)} €
                            </div>
                        </div>
                        <p className="text-stone-400 text-lg leading-relaxed font-light">
                            {product.description}
                        </p>
                        {product.calories && (
                            <span className="inline-block mt-4 text-sm text-stone-500 bg-stone-900 px-3 py-1 rounded-full border border-stone-800">
                                {product.calories} kcal
                            </span>
                        )}
                    </div>

                    {/* Ingredients */}
                    {product.ingredients && product.ingredients.length > 0 && (
                        <div className="mb-10">
                            <h3 className="text-sm uppercase tracking-widest text-stone-500 font-bold mb-4">Ingrédients</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.ingredients.map((ing, i) => (
                                    <span key={i} className="px-4 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 text-sm">
                                        {ing}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Options Groups */}
                    {product.optionGroups?.map(group => (
                        <div key={group.id} className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white font-serif">{group.name}</h3>
                                {group.required && <span className="text-xs text-primary-500 bg-primary-900/20 px-2 py-1 rounded-full uppercase font-bold tracking-wider">Requis</span>}
                                {!group.required && group.type === 'multiple' && <span className="text-xs text-stone-500 uppercase tracking-wider">Max {group.maxQuantity || 'illimité'}</span>}
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {group.options.map(option => {
                                    const isSelected = selectedOptions[group.id]?.includes(option.id);
                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => toggleOption(group, option)}
                                            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 group text-left ${isSelected
                                                    ? 'bg-primary-900/10 border-primary-500'
                                                    : 'bg-stone-900 border-stone-800 hover:border-stone-600'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-primary-500 bg-primary-500' : 'border-stone-600'
                                                    }`}>
                                                    {isSelected && <IoCheckmarkCircle className="w-full h-full text-white" />}
                                                </div>
                                                <span className={isSelected ? 'text-white font-medium' : 'text-stone-400 group-hover:text-stone-200'}>
                                                    {option.name}
                                                </span>
                                            </div>
                                            {option.price > 0 && (
                                                <span className="text-primary-500 font-bold">+{option.price.toFixed(2)} €</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                </div>

                {/* Bottom Action Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 bg-stone-900/90 backdrop-blur-xl border-t border-stone-800">
                    <div className="flex items-center gap-6 max-w-2xl mx-auto">
                        <div className="flex items-center bg-stone-950 rounded-2xl border border-stone-800 p-2">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-stone-900 text-stone-300 hover:text-white"
                            >
                                <IoRemove />
                            </button>
                            <span className="w-16 text-center text-xl font-bold text-white font-serif">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-stone-900 text-stone-300 hover:text-white"
                            >
                                <IoAdd />
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!isSelectionValid}
                            className="flex-1 bg-primary-600 text-white rounded-2xl h-16 text-xl font-bold font-serif shadow-lg hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-between px-8"
                        >
                            <span>{isSelectionValid ? 'Ajouter à ma commande' : 'Sélection incomplète'}</span>
                            <span>{totalPrice.toFixed(2)} €</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
